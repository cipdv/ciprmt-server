import express from 'express'
import TreatmentPlan from '../models/treatmentPlan.js'
import Treatment from '../models/treatment.js'
import User from '../models/user.js'
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = express.Router()

export const createNewTreatmentPlan = async (req, res) => {
    const data = req.body
    const newTreatmentPlan = new TreatmentPlan({...data, clientId: req.params.userid})
    try {
        const result = await newTreatmentPlan.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getTreatmentPlans = async (req, res) => {
    const {userid} = req.params
    try {
        const result = await TreatmentPlan.find({clientId: userid})
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getTreatmentPlanById = async (req, res) => {
    const {tpid} = req.params
    try {
        const result = await TreatmentPlan.findById(tpid)
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const getTreatmentById = async (req, res) => {
    const {tid} = req.params
    try {
        const treatment = await Treatment.findById({_id: tid})
        res.status(200).json(treatment)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const updateTreatmentPlan = async (req, res) => {

    const { tpid } = req.params
    const { conclusionOfTreatmentPlan } = req.body
    
    //set end date
    let endDate = ''
    if (conclusionOfTreatmentPlan !== '') {
        endDate = new Date()
    } else {
        endDate = ''
    }

    try {
        const updatedTreatmentPlan = await TreatmentPlan.findByIdAndUpdate(tpid, {...req.body, endDate}, {new: true})
        if (updatedTreatmentPlan) {
            res.status(200).json({message: 'treatment plan updated', updatedTreatmentPlan})
        } else {
            res.json({message: 'something went wrong'})
        }
    } catch (error) {
        console.log(error.message)
        res.json({message: 'something went wrong'})
    }
}

export const getTreatmentsByClientId = async (req, res) => {
    const { clientId: id } = req.params
    try {
        const results = await Treatment.find({clientId: id})
        res.status(200).json(results)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
} 

export const getTreatmentsByTreatmentPlanId = async (req, res) => {
    try {
        const results = await Treatment.find({treatmentPlanId: req.params.tpid})
        res.status(200).json(results)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const addTreatment = async (req, res) => {   
    try {
        const {date, time, duration, firstName, lastName, email} = req.body
    
        //check for missing fields
        if (date === null) {
            return res.json({message: 'date is mandatory'})
        } else if (time === null) {
            return res.json({message: 'time is mandatory'})
        } else if (duration === '') {
            return res.json({message: 'duration is mandatory'})
        }

        //insert event into google calendar
        const apptDate = new Date(`${date}T${time}:00-05:00`).toISOString(true)

        const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
        const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
        const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
        const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
        const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
            
        let endDateTime = ''
        if (duration === '60') {
            let newDate = new Date(apptDate)
            newDate.setHours(newDate.getHours() + 1)
            endDateTime = newDate.toISOString()
        } else if (duration === '75') {
            let newDate = new Date(apptDate)
            newDate.setMinutes(newDate.getMinutes() + 75)
            endDateTime = newDate.toISOString()
        } else if (duration === '90') {
            let newDate = new Date(apptDate)
            newDate.setMinutes(newDate.getMinutes() + 90)
            endDateTime = newDate.toISOString()
        }

        const appointment = {
            'summary': `Mx: ${firstName} ${lastName}`,
            'start': {
                'dateTime': `${apptDate}`,
                'timeZone': 'Canada/Eastern'
            },
            'end': {
                'dateTime': `${endDateTime}`,
                'timeZone': 'Canada/Eastern'
            },
            'colorId': '2'
        }

        const jwtClient = new google.auth.JWT(
            GOOGLE_CLIENT_EMAIL,
            null,
            GOOGLE_PRIVATE_KEY,
            SCOPES
        )

        const calendar = google.calendar({
            version: 'v3',
            project: GOOGLE_PROJECT_NUMBER,
            auth: jwtClient
        })
        
        let eventId = ''
        calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            resource: appointment,
        }, function(err, event) {
            if (err) {
              console.log('There was an error contacting the Calendar service: ' + err);
              return;
            }
            return eventId =  event.data.id
        })

        //send confirmation email
        const msg = {
            to: `${email}`,
            from: 'cipdevries@ciprmt.com', 
            subject: `Please confirm your appointment with Cip de Vries, RMT`,
            text: `Please login to your account at www.ciprmt.com to confirm your appointment`,
            html: `
            <h4>Hi ${firstName},</h4>
            <p>
                Please login to your account at <a href="https://www.ciprmt.com/auth">www.ciprmt.com</a> to confirm your massage therapy appointment on ${date} at ${time}.
            </p>
            <p>
                Trouble logging in? Please text Cip de Vries at 416-258-1230.
            </p>
            <p>Thanks for checking out my new website! I've worked really hard to create this over the past year, and I'm continuing to learn more about coding to add new features including sending your receipts directly to your email.</p>
            <p>If you have any ideas how to improve the website, notice any performance issues, or have an idea for a cool feature, feel free to text me at 416-258-1230 or send me an email at cip.devries@gmail.com.</p>
            `
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
                return res.json({message: 'something went wrong sending email'})
            })

        //save treatment to database
        const newTreatment = new Treatment({...req.body, googleCalendarId: eventId})
        const result = await newTreatment.save()
    
        return res.status(200).json({result, message: 'treatment added successfully'})
        
    } catch (error) {
        res.json({message: 'something went wrong somewhere'})
    }
}

export const sendConfirmEmail = async (req, res) => {

    const user = await User.findById(req.params.clientid)

    try {
        const msg = {
            to: `${user.email}`, // Change to your recipient
            from: 'cipdevries@ciprmt.com', // Change to your verified sender
            subject: `Please confirm your appointment with Cip de Vries, RMT`,
            text: `Please login to your account at www.ciprmt.com to confirm your appointment`,
            html: `
            <h4>Hi ${user?.firstName},</h4>
            <p>
                Please login to your account at <a href="https://www.ciprmt.com/auth">www.ciprmt.com</a> to confirm your massage therapy appointment on ${req.body.date} at ${req.body.time}.
            </p>
            <p>
                Trouble logging in? Please text Cip de Vries at 416-258-1230.
            </p>
            <p>Thanks for checking out my new website! I've worked really hard to create this over the past year, and I'm continuing to learn more about coding to add new features including sending your receipts directly to your email.</p>
            <p>If you have any ideas how to improve the website, notice any performance issues, or have an idea for a cool feature, feel free to text me at 416-258-1230 or send me an email at cip.devries@gmail.com.</p>
            `
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.send('email sent')
            })
            .catch((error) => {
                console.error(error)
            }) 
    } catch (error) {
        console.log(console.error)
    }
}

export const updateTreatment = async (req, res) => {
    const { tid } = req.params

    try {
        const updatedTreatment = await Treatment.findByIdAndUpdate(tid, req.body, {new: true})
        res.status(200).json(updatedTreatment)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const clientConfirmedTreatment = async (req, res) => {

    const { name, apptDate, apptTime, reasonForMassage, glutesConsent, chestConsent, abdomenConsent, innerThighsConsent, areasToAvoid, notes } = req.body

    let glutes = ''
    let chest = ''
    let abdomen = ''
    let innerThighs = ''

    if (glutesConsent) {
        glutes = 'yes'
     } else {
        glutes = 'no'
     }
   
     if (chestConsent) {
        chest = 'yes'
    } else {
        chest = 'no'
    }
   
    if (abdomenConsent) {
        abdomen = 'yes'
   } else {
        abdomen = 'no'
   }
   
   if (innerThighsConsent) {
        innerThighs = 'yes'
   } else {
        innerThighs = 'no'
   }

    const msg = {
        to: `cipdevries@ciprmt.com`,
        from: 'cipdevries@ciprmt.com', // Change to your verified sender
        subject: `Confirmed: ${name} on ${apptDate} at ${apptTime} `,
        text: `${name} has confirmed their appointment on ${apptDate} at ${apptTime}`,
        html: `
          <p>${name} has confirmed an appointment on ${apptDate} at ${apptTime}</p>
          <p>Reason for booking a massage is: ${reasonForMassage}</p> 
          <p>Consents given:</p>
          <ul>
            <li>Glutes: ${glutes}</li>
            <li>Chest: ${chest}</li>
            <li>Abdomen: ${abdomen}</li>
            <li>Inner Thighs: ${innerThighs}</li>
          </ul>
          <p>Areas to avoid: ${areasToAvoid}</p>
          <p>Notes provided: ${notes}</p>
        `,
      }

    try {
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.send('email sent')
        })
            .catch((error) => {
            console.error(error)
        }) 
    } catch (error) {
        console.log(error.message)
    }
}

export const sendReceipt = async (req, res) => {
    const {firstName, email} = req.body
    try {
        const msg = {
            to: `${email}`, // Change to your recipient
            from: 'cipdevries@ciprmt.com', // Change to your verified sender
            subject: `Your Massage Therapy Treatment Receipt is Ready to Download`,
            text: `Please login to your account at www.ciprmt.com to download your receipt.`,
            html: `
            <h4>Hi ${firstName},</h4>
            <p>
                Your receipt is ready to download. Login at <a href="https://www.ciprmt.com/auth">www.ciprmt.com</a> to view and download receipts.
            </p>
            <p>
                Trouble logging in? Please text Cip de Vries at 416-258-1230.
            </p>
            <p>Thanks for checking out my new website! I've worked really hard to create this over the past year, and I'm continuing to learn more about coding to add new features including sending your receipts directly to your email.</p>
            <p>If you have any ideas how to improve the website, notice any performance issues, or have an idea for a cool feature, feel free to text me at 416-258-1230 or send me an email at cip.devries@gmail.com.</p>
            `
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.send('email sent')
            })
            .catch((error) => {
                console.error(error)
            }) 
    } catch (error) {
        console.log(console.error)
    }
}

export const getAllTreatments = async (req, res) => {
    try {
        const result = await Treatment.find()
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const deleteTreatment = async (req, res) => {
    try {
        await Treatment.findByIdAndDelete(req.params.tid)
        const result = await Treatment.find({clientId: req.params.pid})
        if (result) {
            return res.status(200).json({result, message: 'treatment deleted'})
        } else {
            return res.json({message: 'something went wrong'})
        }
    } catch (error) {
        res.json({message: 'treatment not deleted', error})
    }
}

export default router
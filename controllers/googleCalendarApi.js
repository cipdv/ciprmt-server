import express from 'express'
import dotenv from 'dotenv'
import { google } from 'googleapis'

const router = express.Router()
dotenv.config()

export const insertGoogleCalendarEvent = async (req, res)=> {
    try {
        const {firstName, lastName, date, time, duration} = req.body
        const apptDate = new Date(`${date}T${time}:00-04:00`).toISOString(true)

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

        const event = {
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

        
        calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            resource: event,
        }, {
            function (err, event) {
                if (err) {
                    console.log('this is an error', err)
                    return
                }
                console.log('Event created:', event.htmlLink);
            }
        })
    } catch {
        console.log('error')
    }
}

export default router
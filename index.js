//dependencies
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'
import pdf from 'html-pdf'
import {pdfFile} from './documents/index.js'

//import routes
import healthHistoryRoutes from './routes/healthHistory.js'
import userRoutes from './routes/users.js'
import appointmentRoutes from './routes/appointments.js'
import RMTRoutes from './routes/rmt.js'
import financialRoutes from './routes/financials.js'
import EALRoutes from './routes/electronicAuditLog.js'
import maintenanceLog from './routes/maintenanceLog.js'
import treatmentPlanRoutes from './routes/treatmentPlan.js'
import journalRoutes from './routes/journal.js'
import googleRoutes from './routes/googleCalendarApi.js'

//configs
const app = express()
dotenv.config()
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//routing
app.use('/healthhistory', healthHistoryRoutes)
app.use('/user', userRoutes)
app.use('/appointments', appointmentRoutes)
app.use('/rmt', RMTRoutes )
app.use('/financials', financialRoutes)
app.use('/electronicauditlog', EALRoutes)
app.use('/maintenancelog', maintenanceLog)
app.use('/treatmentplan', treatmentPlanRoutes)
app.use('/journal', journalRoutes)
app.use('/google', googleRoutes)

app.get('/', (req, res)=>{
    res.send('Cip de Vries, RMT')
})

//post route to generate pdf and fetching data
app.post('/createpdf', (req, res)=>{
    pdf.create(pdfFile(req.body), {}).toFile('receipt.pdf', (err)=>{
        if(err) {
            res.send(Promise.reject())
        }
        res.send(Promise.resolve())
    })
})


// app.post('/createpdf', (req, res)=>{
//     console.log(req.body)
//     pdf.create(pdfFile(req.body)).toBuffer(function(err, buffer){
//         if(err) return res.send(err);
//         res.type('pdf');
//         res.end(buffer, 'binary')
//     })
// })

//get route to send pdf to client
app.get('/fetchpdf', (req, res)=>{
    res.sendFile(`${__dirname}/receipt.pdf`)
})

app.get('/sendgrid', (req, res)=> {

    const msg = {
        to: 'cipdevries@ciprmt.com', // Change to your recipient
        from: 'cipdevries@ciprmt.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }

    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    res.send('message sent')

})

//connect to mongodb
const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}, you're doing great Cip, keep it up :)`)))
    .catch((error)=> console.log(error.message))

// mongoose.set('useFindAndModify', false)

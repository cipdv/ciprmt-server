import express from 'express'

//controllers
import { createAppointment, getAppointments, getAppointment, updateAppointment, addAppointment, confirmAppointment } from '../controllers/appointments.js'

//middleware
import auth from '../middleware/auth.js'

const router = express.Router()

// -----USER ROUTES-----
//create an appointment
router.post('/', auth, createAppointment)

// -----RMT ROUTES-----
//get user's appointment data
router.get('/:userid', auth, getAppointments)
//get a single appointment
router.post('/:id', auth, getAppointment)
//update appointment data
router.patch('/:userid/:appointmentid', auth, updateAppointment)
//add appointment
router.post('/:id/add', auth, addAppointment)
//confirm appointment
router.patch('/confirm/:userid/:appointmentid', auth, confirmAppointment)



export default router
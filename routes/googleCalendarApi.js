import express from 'express'

const router = express.Router()

import auth from '../middleware/auth.js'

import { insertGoogleCalendarEvent } from '../controllers/googleCalendarApi.js'

router.post('/auth/calendar', auth, insertGoogleCalendarEvent)

export default router 
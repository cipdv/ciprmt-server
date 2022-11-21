import express from 'express'

const router = express.Router()

import auth from '../middleware/auth.js'

import { addToEAL } from '../controllers/electronicAuditLog.js'

router.post('/', addToEAL)

export default router
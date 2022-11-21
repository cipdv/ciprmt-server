import express from 'express'

const router = express.Router()

import auth from '../middleware/auth.js'

import { addJournalEntry } from '../controllers/journal.js'

router.post('/addentry', auth, addJournalEntry)

export default router
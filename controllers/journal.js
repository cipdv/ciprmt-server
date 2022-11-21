//dependencies
import express from 'express'
//models
import Journal from '../models/journal.js'

const router = express.Router()

export const addJournalEntry = async (req, res) => {

    const { entry } = req.body

    const newEntry = new Journal({entry, dateCreated: new Date().toISOString()})

    try {
        const result = await newEntry.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export default router
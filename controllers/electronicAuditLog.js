import express from 'express'
import ElectronicAuditLog from '../models/electronicAuditLog.js'

const router = express.Router()

export const addToEAL = async (req, res) => {

    const log = req.body
    const newLog = new ElectronicAuditLog({...log, dateAndTime: new Date().toISOString()})

    try {
        await newLog.save()
        res.status(200).json(newLog)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
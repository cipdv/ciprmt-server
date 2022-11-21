import express from 'express'

//controllers
import { createHealthHistory, getAllUsers, getHH, getUserBySearch, addNewHealthHistory, getClientHealthHistory } from '../controllers/healthHistory.js'

//middleware
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/addnewhealthhistory', auth, addNewHealthHistory)

//USER ----------------

//CREATE the HH 
router.put('/', auth, createHealthHistory)

//ADMIN ---------------
//READ all HHs
router.get('/', auth, getAllUsers)
//READ a single HH
router.post('/:id', auth, getHH)
//SEARCH for a user
router.get('/search', auth, getUserBySearch)
//DELETE the HH (admin only)
// router.delete('/:id', deleteHH)

//nEw RoUtEs
//CLIENT SIDE

router.post('/gethealthhistorybyclientid/:clientId', auth, getClientHealthHistory)

export default router


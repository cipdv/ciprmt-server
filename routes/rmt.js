import express from 'express'

//controllers
import { RMTRegister, RMTLogin } from '../controllers/rmts.js'

const router = express.Router()

//register user
router.post('/register', RMTRegister)
//login user
router.post('/login', RMTLogin)

export default router

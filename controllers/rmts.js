import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import RMT from '../models/rmt.js'

//configs
dotenv.config()

//REGISTER a user
export const RMTRegister = async (req, res) => {
    const { firstName, lastName, email, registrationNumber, HSTNumber, password, confirmPassword, userType } = req.body
    const jwtSecret = process.env.jwtSecret
    try {
        //check if user exists
        const existingUser = await RMT.findOne({email})
        if (existingUser) {
            return res.status(404).json({message: `user already exist`})
        }
        //check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: `passwords don't match` })
        }
        //if passwords match, hash data
        const hashPassword = await bcrypt.hash(password, 12)
        //create user model
        const result = await RMT.create({firstName, lastName, email, registrationNumber, HSTNumber, password: hashPassword, userType: 'rmt'})
        //assign token
        const token = jwt.sign({email: result.email, id: result._id, userType: result.userType}, jwtSecret, {expiresIn: '1h'})
        //return user with token
        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: `something went wrong`})
        console.log(error)
    }
}

//LOGIN a user
export const RMTLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const jwtSecret = process.env.jwtSecret

        try {
            const existingUser = await RMT.findOne({email}) 
            if (!existingUser) {
                return res.json({message: `user doesn't exist`})
            }

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
            if (!isPasswordCorrect) {
                return res.json({message: `invalid password`})
            }

            const token = jwt.sign({email: existingUser.email, id: existingUser._id, userType: existingUser.userType}, jwtSecret, {expiresIn: '1h'})

            res.status(200).json({ result: existingUser, token, message: 'login successful' })

        } catch (error) {
            res.status(500).json({ message: `login failed` })
            console.log(error)
        }

    } catch (error) {
        res.status(500).json({ message: `something went wrong`})
    }
}


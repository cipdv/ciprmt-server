import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verify = async (req, res, next) => {
    try {
        const token = req?.headers?.token
        const jwtSecret = process.env.jwtSecret

        let decodedData

        if(token) {
            decodedData = jwt.verify(token, jwtSecret)
            req.userType = decodedData?.userType
        } else {
            decodedData = jwt.decode(token)

            req.userId = decodedData?.sub
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export default verify
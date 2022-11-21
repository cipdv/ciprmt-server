import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const auth = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500
        const jwtSecret = process.env.jwtSecret

        let decodedData

        if(token) {
            decodedData = jwt.verify(token, jwtSecret)

            req.userId = decodedData?.id

        } else {
            decodedData = jwt.decode(token)

            req.userId = decodedData?.sub
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export default auth
import mongoose from 'mongoose'

const passwordResetSchema = mongoose.Schema({
    createdAt: {type: Date, default: new Date(), expires: '60m'},
    token: String,
    email: String
})

export default mongoose.model('PasswordReset', passwordResetSchema)
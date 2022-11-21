import mongoose from 'mongoose'

const electronicAuditLogSchema = new mongoose.Schema({
    id: String,
    typeOfInfo: String,
    actionPerformed: String,
    dateAndTime: String,
    accessedBy: String,
    whoseInfo: String
})

export default mongoose.model('ElectronicAuditLog', electronicAuditLogSchema) 
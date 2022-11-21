import mongoose from 'mongoose'

const maintenanceLogSchema = new mongoose.Schema({
    dateAndTime: String,
    RMTId: String,
    massageMatNoTears: Boolean,
    massageMatNotes: String,
    electronicsNoDamage: Boolean,
    electronicsNotes: String,
    selfCareToolsNoDamage: Boolean,
    selfCareToolsNotes: String
})

export default mongoose.model('MaintenanceLog', maintenanceLogSchema) 
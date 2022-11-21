import mongoose from 'mongoose'

const treatmentPlanSchema = mongoose.Schema({
    id: String,
    clientId: String,
    startDate: Date,
    clientGoals: String,
    typeAndFocusOfTreatments: String,
    areasToBeTreated: String,
    durationAndFrequency: String,
    scheduleForReassessment: String,  
    anticipatedClientResponse: String,
    recommendedSelfCare: String,
    conclusionOfTreatmentPlan: String,
    endDate: Date,
})

export default mongoose.model('TreatmentPlan', treatmentPlanSchema)
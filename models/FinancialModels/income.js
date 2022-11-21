import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    id: String,
    RMTid: String,
    treatmentId: String,
    date: Date,
    year: String,
    //revenue, governemnt credit, other
    category: String,
    amount: Number,
    details: String,
})

export default mongoose.model('Income', incomeSchema) 
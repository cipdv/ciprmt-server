import mongoose from 'mongoose'

const RRSPSchema = new mongoose.Schema({
    id: String,
    RMTid: String,
    date: {type: Date, default: new Date()},
    year: String,
    //revenue, governemnt credit, other
    amount: Number,
    details: String,
})

export default mongoose.model('RRSPContribution', RRSPSchema) 
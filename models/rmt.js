import mongoose from 'mongoose'

const financialStatementsSchema = new mongoose.Schema({
    id: String,

    RMTid: String,
    year: Number,
    income: [
        {
            type: String,
            //revenue, governemnt credit, other
            amount: Number,
            dateCollected: String,
            appointmentId: String
        }
    ],
    expenses: [
        {
            category: String,
            //advertising, travel, licenses, insurance, interest paid, repairs and maintenance, supplies, office supplies, bank fees, adminstrative fees
            amount: Number,
            details: String,
            datePaid: String 
        }
    ],
    HST: {
        collected: Number,
        paid: Number
    },
    donations: [
        {
            dateDonated: String,
            amount: Number
        }
    ],
    RRSPContributions: [
        {
            dateContributed: String,
            amount: Number
        }
    ]

})


const RMTSchema = new mongoose.Schema({
    id: {type: String},
    googleId: String,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    registrationNumber: {type: String, required: true},
    HSTNumber: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    userType: String,
    financials: [financialStatementsSchema]
})

export default mongoose.model('RMT', RMTSchema) 
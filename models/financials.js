import mongoose from 'mongoose'

const financialsSchema = new mongoose.Schema({
    id: String,
    RMTid: String,
    year: String,
    income: [
        {
            category: String,
            //revenue, governemnt credit, other
            amount: Number,
            date: Date,
            appointmentId: String,
            details: String,
            receiptNumber: String
        }
    ],
    expenses: [
        {
            category: String,
            //advertising, travel, licenses, insurance, interest paid, repairs and maintenance, supplies, office supplies, bank fees, adminstrative fees
            amount: Number,
            details: String,
            date: Date,
            receiptNumber: String
        }
    ],
    HST: [
        {
            amountCollected: Number,
            period: String,
            //Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec
            date: String,
        }
    ],
    donations: [
        {
            date: String,
            amount: Number,
            details: String
        }
    ],
    RRSPContributions: [
        {
            date: String,
            amount: Number
        }
    ],
    Taxes: Number
})

export default mongoose.model('FinancialStatement', financialsSchema) 
import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    id: String,
    RMTid: String,
    treatmentId: String,
    date: Date,
    year: String,
    category: String,
    //advertising, travel, licenses, insurance, interest paid, repairs and maintenance, supplies, office supplies, bank fees, adminstrative fees
    amount: Number,
    details: String,
})

export default mongoose.model('Expense', expenseSchema) 
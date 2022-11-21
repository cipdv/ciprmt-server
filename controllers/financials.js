import express from "express"
import mongoose from "mongoose"

//models
import FinancialStatement from '../models/financials.js'
import Income from '../models/FinancialModels/income.js'
import Expense from "../models/FinancialModels/expense.js"
import RRSPContribution from '../models/FinancialModels/rrspcontributions.js'
import Donations from "../models/FinancialModels/donations.js"

const router = express.Router()

export const createNewFinancialStatement = async (req, res) => {
    const { rmtid } = req.params
    const { year } = req.body
    const newFinancialStatement = new FinancialStatement({year: year, RMTid: rmtid})
    try {
        const result = await newFinancialStatement.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const addFinancials = async (req, res) => {
    const { type, date, category, amount } = req.body

    try {
        if (type === 'rrsp') {
            const newRRSPContribution = new RRSPContribution({...req.body, RMTid: req.params.rmtid, year: new Date(date).getFullYear()})
            try {
                await newRRSPContribution.save()
            } catch (error) {
                res.status(404).json({message: error.message})
            }
        } else if (type === 'donation') {
            const newDonation = new Donation({...req.body, RMTid: req.params.rmtid, year: new Date(date).getFullYear()})
            try {
                await newDonation.save()
            } catch (error) {
                res.status(404).json({message: error.message})
            }
        } else if (type === 'income') {
            const newIncome = new Income({...req.body, RMTid: req.params.rmtid, year: new Date(date).getFullYear()})
            try {
                const result = await newIncome.save()
                res.status(200).json({result, type: 'income'})
            } catch (error) {
                res.status(404).json({message: error.message})
            }
        } else if (type === 'expense') {
            if(category === 'rent') {
                const newExpense = new Expense({...req.body, amount: amount * 0.48, RMTid: req.params.rmtid, year: new Date(date).getFullYear()})
                try {
                    const result = await newExpense.save()
                    res.status(200).json({result, type: 'expense'})
                } catch (error) {
                    res.status(404).json({message: error.message})
                }
            } else {
                const newExpense = new Expense({...req.body, RMTid: req.params.rmtid, year: new Date(date).getFullYear()})
                try {
                    const result = await newExpense.save()
                    res.status(200).json({result, type: 'expense'})
                } catch (error) {
                    res.status(404).json({message: error.message})
                }
            }   
        }
    } catch (error) {
        res.json({message: 'error', error})
    }
}

export const addTransaction = async (req, res) => {

    console.log(req.body)

    const income = req.body.income[0]
    const expenses = req.body.expenses[0]
    const thisreceiptNumber = req.body.income[0].receiptNumber
    const year = req.body.year
    
    try {
        const financialStatement = await FinancialStatement.findOne({year: 2022})
        
        const alreadyAddded = financialStatement.income.find(({ receiptNumber }) => receiptNumber === thisreceiptNumber )
    
        if (alreadyAddded === undefined) {
            financialStatement?.income?.push(income)
            financialStatement?.expenses?.push(expenses)

            const updatedFinancialStatement = await FinancialStatement.findOneAndUpdate({year: 2022}, financialStatement, {new: true})
            res.status(200).json(updatedFinancialStatement)
        } else {
            res.status(200).json(financialStatement)
        }     
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const getFinancialData = async (req, res) => {
    try {
        const financialData = await FinancialStatement.find({year: req.body.year})
        res.status(200).json(financialData)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

// export const addFinancials = async (req, res) => {
//     const {type} = req.body
//     if (type === 'Expense') {
//         const financialData = await FinancialStatement.findOne({year: 2022})
//         financialData?.expenses?.push(req.body)
//         const updatedFinancialStatement = await FinancialStatement.findOneAndUpdate({year: 2022}, financialData, {new: true})
//         res.status(200).json(updatedFinancialStatement)
//     } else if (type === 'Income') {
//         const financialData = await FinancialStatement.findOne({year: 2022})
//         financialData?.income?.push(req.body)
//         const updatedFinancialStatement = await FinancialStatement.findOneAndUpdate({year: 2022}, financialData, {new: true})
//         res.status(200).json(updatedFinancialStatement)
//     } else if (type === 'RRSP Contribution') {
//         const financialData = await FinancialStatement.findOne({year: 2022})
//         financialData?.RRSPContributions?.push(req.body)
//         const updatedFinancialStatement = await FinancialStatement.findOneAndUpdate({year: 2022}, financialData, {new: true})
//         res.status(200).json(updatedFinancialStatement)
//     } else if (type === 'Donation') {
//         const financialData = await FinancialStatement.findOne({year: 2022})
//         financialData?.donations?.push(req.body)
//         const updatedFinancialStatement = await FinancialStatement.findOneAndUpdate({year: 2022}, financialData, {new: true})
//         res.status(200).json(updatedFinancialStatement)
//     }
// }

export const getFinancialStatementsByRMTId = async (req, res) => {
    const {rmtid} = req.params
    try {
        const result = await FinancialStatement.find({RMTid: rmtid})
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const addIncome = async (req, res) => {
    const income = req.body
    //check first if it has already been added
    const alreadyAddded = await Income.find({treatmentId: income?.treatmentId})
    if(alreadyAddded?.length === 0) {
        const newIncome = new Income({...income, RMTid: req.params.rmtid, year: new Date(income?.date).getFullYear()})
        try {
            await newIncome.save()
            res.status(200).json(newIncome)
        } catch (error) {
            res.status(404).json({message: error.message})
        }
    } else {
        res.status(200).json(income)
    }
    
}

export const addExpense = async (req, res) => {
    const expense = req.body

    console.log(expense)

    // if (expense?.category === 'rent' || expense?.category === 'hydro') {
    //     const newExpense = new Expense({...expense, amount, RMTid: req.params.rmtid, year: new Date(expense?.date).getFullYear()})
    //     try {
    //         await newExpense.save()
    //         res.status(200).json(newExpense)
    //     } catch (error) {
    //         res.status(404).json({message: error.message})
    //     }
    // }

    // const alreadyAddded = await Expense.find({treatmentId: expense?.treatmentId})
    // if(alreadyAddded?.length === 0) {
    //     if (expense?.category === 'rent' || expense?.category === 'hydro') {
    //         const newExpense = new Expense({...expense, amount, RMTid: req.params.rmtid, year: new Date(expense?.date).getFullYear()})
    //         try {
    //             await newExpense.save()
    //             res.status(200).json(newExpense)
    //         } catch (error) {
    //             res.status(404).json({message: error.message})
    //         }
    //     } else {
    //         const newExpense = new Expense({...expense, RMTid: req.params.rmtid, year: new Date(expense?.date).getFullYear()})
    //         try {
    //             await newExpense.save()
    //             res.status(200).json(newExpense)
    //         } catch (error) {
    //             res.status(404).json({message: error.message})
    //         }
    //     }
    // } else {
    //     res.status(200).json(expense)
    // }
}

export const getAllIncomes = async (req, res) => {
    const {year} = req.body
    try {
        const incomeData = await Income.find({year: year})
        res.status(200).json(incomeData)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const getAllExpenses = async (req, res) => {
    const {year} = req.body
    try {
        const expenseData = await Expense.find({year: year})
        res.status(200).json(expenseData)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const getIncomeByMonthAndYear = async (req, res) => {
    const {year, month} = req.params
    try {
        const result = await Income.aggregate([
            {$addFields: {  "month" : {$month: '$date'}}},
            {$match: {"$and": [{month: parseInt(month, 10)}, {year: year}]}},
          ]);
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const getExpensesByMonthAndYear = async (req, res) => {
    const {year, month} = req.params
    try {
        const result = await Expense.aggregate([
            {$addFields: {  "month" : {$month: '$date'}}},
            {$match: {"$and": [{month: parseInt(month, 10)}, {year: year}]}},
          ]);
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json(error.message)
    }
}
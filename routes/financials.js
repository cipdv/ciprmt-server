import express from 'express'

//controllers
import { getIncomeByMonthAndYear, addTransaction, createNewFinancialStatement, getFinancialData, addFinancials, getFinancialStatementsByRMTId, addIncome, addExpense, getAllIncomes, getAllExpenses, getExpensesByMonthAndYear } from '../controllers/financials.js'

//middleware
import auth from '../middleware/auth.js'

const router = express.Router()

//USER ----------------

//CREATE the HH 
router.put('/:id', auth, addTransaction)
//add a new year
router.post('/addnewfinancialstatement/:rmtid', createNewFinancialStatement)
//retrieve financial data per year
router.post('/getfinancialdata', auth, getFinancialData)
router.post('/addfinancials', auth, addFinancials)
router.get('/getfinancialstatementsbyrmtid/:rmtid', getFinancialStatementsByRMTId)
//get income and expenses by year and month
router.get('/getincomebyyearandmonth/:year/:month', getIncomeByMonthAndYear)
router.get('/getexpensesbyyearandmonth/:year/:month', getExpensesByMonthAndYear)

//new financial routes
router.post('/:rmtid/addincome', auth, addIncome)
router.post('/:rmtid/addexpense', auth, addExpense)
router.post('/getincomes', getAllIncomes)
router.post('/getexpenses', getAllExpenses)
router.post('/addTransaction', addTransaction)

export default router
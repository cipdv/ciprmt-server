import express from 'express'

const router = express.Router()

import auth from '../middleware/auth.js'

import { getTreatmentPlans, createNewTreatmentPlan, addTreatment, getTreatmentPlanById, getTreatmentById, updateTreatmentPlan, getTreatmentsByClientId, getTreatmentsByTreatmentPlanId, updateTreatment, sendConfirmEmail, clientConfirmedTreatment, sendReceipt, getAllTreatments, deleteTreatment } from '../controllers/treatmentPlan.js'

router.post('/getallforthisuser/:userid', auth, getTreatmentPlans)
router.post('/createnewforthisuser/:userid', auth, createNewTreatmentPlan)
router.post('/:tpid/addTreatment/:clientid', auth, addTreatment)
router.post('/getTreatmentPlanById/:tpid', auth, getTreatmentPlanById)
router.post('/gettreatmentbyid/:tid', auth, getTreatmentById)
router.put('/:tpid/update', auth, updateTreatmentPlan) 
router.post('/getTreatmentsByClientId/:clientId', auth, getTreatmentsByClientId)
router.post('/:tpid/gettreatments', auth, getTreatmentsByTreatmentPlanId)
router.post('/addtreatment', auth, addTreatment)
router.put('/treatment/:tid/updatetreatment', auth, updateTreatment)
router.post('/sendconfirmemail/:clientid', auth, sendConfirmEmail)
router.post('/sendemailtormtforconfirmedappt', auth, clientConfirmedTreatment)
router.post('/sendreceipt', auth, sendReceipt)
router.get('/getalltreatments', auth, getAllTreatments)
router.delete('/deletetreatment/:pid/:tid', auth, deleteTreatment)

export default router
import mongoose from 'mongoose'

const HHSchema = mongoose.Schema({
    createdAt: {type: Date, default: new Date()},
    pronouns: {type: String, required: [true, 'pronouns blank']},
    occupation: String,
    phoneNumber: {type: String, required: [true, 'phone number blank']},
    address: {
        streetNumber: {type: String, required: [true, 'street number blank']},
        streetName: {type: String, required: [true, 'street name blank']},
        city: {type: String, required: [true, 'city blank']},
        province: {type: String, required: [true, 'province blank']},
    },
    dateOfBirth: {type: Date, required: [true, 'date of birth blank']},
    doctor: {
        doctorName: {type: String, required: [true, 'doctor name blank']},
        doctorAddress: {
            doctorStreetNumber: String,
            doctorStreetName: String,
            doctorCity: String,
            doctorProvince: String
        },
    },
    generalHealth: {type: String, required: [true, 'general health blank']},
    historyOfMassage: {type: String, required: [true, 'history of massage blank']},
    injuries: String,
    surgeries: String,
    otherHCP: String,
    cardioNone: Boolean,
    highBloodPressure: Boolean,
    lowBloodPressure: Boolean,
    heartAttack: Boolean,
    vericoseVeins: Boolean,
    stroke: Boolean,
    pacemaker: Boolean,
    heartDisease: Boolean,
    respNone: Boolean,
    chronicCough: Boolean,
    bronchitis: Boolean,
    asthma: Boolean,
    emphysema: Boolean,
    skinConditions: String,
    infectiousConditions: String,
    diabetes: Boolean,
    epilepsy: Boolean,
    cancer: Boolean,
    arthritis: Boolean,
    arthritisFamilyHistory: Boolean,
    chronicHeadaches: Boolean,
    migraineHeadaches: Boolean,
    visionLoss: Boolean, 
    hearingLoss: Boolean,
    osteoporosis: Boolean,
    haemophilia: Boolean,
    internalEquipment: String,
    otherMedicalConditions: String,
    lossOfFeeling: String,
    allergies: String,
    pregnant: String,
    medications: String,
    consent: {
        glutes: Boolean,
        innerThighs: Boolean,
        abdomen: Boolean,
        chest: Boolean,
        areasToAvoid: String,
    },
    privacyPolicy: {type: Boolean, required: [true, 'privacy policy left unchecked']},
    sourceOfReferral: String
})

const userSchema = mongoose.Schema({
    id: {type: String},
    firstName: {type: String, required: [true, 'no first name']},
    lastName: {type: String, required: [true, 'no last name']},
    email: {type: String, required: [true, 'no email']},
    phoneNumber: {type: String},
    emailReceiptOptIn: {type: Boolean},
    password: {type: String, required: [true, 'no password']},
    userType: {type: String},
    // healthHistory: [HHSchema],
    // signature: String
})

export default mongoose.model('User', userSchema) 
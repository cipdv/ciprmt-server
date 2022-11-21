import mongoose from 'mongoose'

const journalSchema = new mongoose.Schema({
    id: String,
    dateCreated: String,
    entry: String
})

export default mongoose.model('Journal', journalSchema) 
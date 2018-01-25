const mongoose = require('mongoose')
const Schema = mongoose.Schema

const specimenSchema = Schema({
    species: {
        type: Schema.Types.ObjectId,
        ref: 'Species'
    },
    country: String,
    state: String,
    county: String,
    date: Date,
    specimen: String,
    note: String,
    imgUrl: String,
    progress: String // PENDING/FULFILLED
})

module.exports = mongoose.model('Specimen', specimenSchema)

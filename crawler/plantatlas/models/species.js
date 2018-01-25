const mongoose = require('mongoose')
const Schema = mongoose.Schema

const speciesSchema = mongoose.Schema({
    scientificName: String,
    commonName: String,
    family: String,
    status: String,
    url: String,
    specimens: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Specimen'
        }
    ],
    progress: String // NEW/PROCESSING/DONE
})

module.exports = mongoose.model('Species', speciesSchema)
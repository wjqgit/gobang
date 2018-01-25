const Species = require('../models/species')
const Specimen = require('../models/specimen')

function createSpecies(speciesInfo) {

    return new Promise((resolve, reject) => {

        const scientificName = speciesInfo.scientificName,
            url = speciesInfo.url

        if (scientificName && url) {

            Species.findOne({
                "scientificName": scientificName
            }, (err, species) => {

                if (err) reject(err)

                if (species === null) {

                    species = new Species()

                    species.scientificName = scientificName
                    species.url = url
                    species.progress = 'NEW'

                    species.save((err, data) => {
                        if (err) reject(err)

                        resolve(data)
                    })

                } else {
                    reject(`${scientificName} already created`)
                }

            })

        } else {
            reject('insufficient info to create species')
        }


    })

}

function createMultipleSpecies(speciesInfoList) {
    const jobs = []

    for (let i = 0; i < speciesInfoList.length; i++) {
        jobs.push(createSpecies(speciesInfoList[i]))
    }

    return Promise.all(jobs)
}

function readNewSpecies() {

    return new Promise((resolve, reject) => {

        Species.find({
            'progress': 'NEW'
        }, (err, data) => {
            if (err) reject(err)

            resolve(data)
        })

    })
}


function updateSpecies(species, specimenInfoList) {

    return new Promise((resolve, reject) => {

        if (species) {

            if (specimenInfoList && specimenInfoList.length > 0) {

                createMultipleSpecimen(specimenInfoList).then(data => {
                    
                    Specimen.find({
                        "species": species._id
                    }, (err, specimens) => {

                        for(let i = 0; i < specimens.length; i++) {

                            species.specimens.push(specimens[i]._id)

                        }

                        if (species.specimens.length > 0) species.progress = "PROCESSING"

                        species.save((err, data) => {
                            if (err) reject(err)
            
                            resolve(data)
                        })


                    })

                })


            } else {
                species.save((err, data) => {
                    if (err) reject(err)
    
                    resolve(data)
                })
            }


        } else {

            reject('nothing to update')

        }


    })

}

// create specimens
function createSpecimen(specimenInfo) {

    return new Promise((resolve, reject) => {

        const species = specimenInfo.species,
            imgUrl = specimenInfo.imgUrl

        if (specimenInfo && species && imgUrl) {

            Specimen.findOne({
                "imgUrl": imgUrl
            }, (err, specimen) => {

                if (err) reject(err)

                if(specimen === null) {

                    const specimen = new Specimen()
        
                    specimen.species = specimenInfo.species
                    specimen.country = specimenInfo.country
                    specimen.state = specimenInfo.state
                    specimen.county = specimenInfo.county
                    specimen.date = specimenInfo.date
                    specimen.specimen = specimenInfo.specimen
                    specimen.note = specimenInfo.note
                    specimen.imgUrl = specimenInfo.imgUrl

                    specimen.save((err, data) => {
                        if (err) reject(err)

                        resolve(data)
                    })

                } else {

                    resolve(specimen)

                }

            })

        } else {

            reject('insufficient info to create specimen')

        }

    })

}

function createMultipleSpecimen(specimenInfoList) {
    const jobs = []

    for(let i = 0; i < specimenInfoList.length; i++) {
        jobs.push(createSpecimen(specimenInfoList[i]))
    }

    return Promise.all(jobs)
}

function readPendingSpecimenBatch(batchSize) {

    return new Promise((resolve, reject) => {

        Specimen.find({
            progress: "PENDING"
        }).populate('species', 'scientificName')
          .limit(batchSize)
          .exec((err, batch) => {
            if (err) reject(err)
            
            resolve(batch)
          })
    })

}

function updateSpecimen(specimen) {
    
    return new Promise((resolve, reject) => {

        specimen.save((err, data) => {

            if(err) reject(err)

            resolve(data)
            
        })
    }) 
}


module.exports = {
    createSpecies: createSpecies,
    createMultipleSpecies: createMultipleSpecies,
    readNewSpecies: readNewSpecies,
    updateSpecies: updateSpecies,
    readPendingSpecimenBatch: readPendingSpecimenBatch,
    updateSpecimen: updateSpecimen
}

const saveAll = (docs) => {
    const saves = [];

    for (let i = 0; i < docs.length; i++) {
        saves.push(docs[i].save())
    }

    return Promise.all(saves)
}
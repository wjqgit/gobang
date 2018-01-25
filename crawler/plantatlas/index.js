require('../globals')

const http = require('http')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const mongoose = require('mongoose')
const dbConfig = require('./config/database')

const Species = require('./services/species')

mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url)

const url = 'http://www.florida.plantatlas.usf.edu'
const folder = path.join(__dirname, 'downloads')

// let page = '/browse/scientific-name'
// let page = '/plant.aspx?id=3936'



/* 
 * get page dom
 * 
 */


getPage = (page) => {

    return new Promise((resolve, reject) => {
        http.get(url + page, (res) => {
            const chunks = []
            let size = 0

            res.on('data', chunk => {
                chunks.push(chunk)
                size += chunk.length
            })

            res.on('end', () => {
                const data = Buffer.concat(chunks, size)
                const html = data.toString();

                const $ = cheerio.load(html)

                resolve($)

            })
        })

    })

}

downloadAndSaveFile = (imgPath, fileName) => {

    return new Promise((resolve, reject) => {
        const filePath = path.join(folder, fileName)

        fs.exists(filePath, exists => {

            if (exists) resolve(`${filePath} exists`)
            else {
                const file = fs.createWriteStream(filePath)

                http.get(url + imgPath, res => {
                    res.pipe(file).on('close', () => {
                        // console.log('closed!!!')
                        resolve(`${filePath} downloaded`)
                    })
                })


            }

        })

    })

}


/*
 * parse browse page and save species info
 */

function saveSpecies() {

    // get browse page
    getPage('/browse/scientific-name').then($ => {
        const creations = []

        $('td>a').each(function () {
            const species = $(this)

            creations.push(Species.createSpecies({
                scientificName: species.html(),
                url: species.attr('href')
            }))

        })

        console.log(`saving ${creations.length} species`)

        return Promise.all(creations)

        // const species = $('td>a').eq(1)

        // return Species.createSpecies({
        //     scientificName: species.html(),
        //     url: species.attr('href')
        // })

    }).then(() => {
        console.log('all species saved')
    }).catch((err) => {
        console.error(err)
    })

}

/* 
 * parse species page and save img url and other info
 */





function updateInfo() {


    function updateSpecies(species) {
        // get species page 
        getPage(species.url).then($ => {
            // family/common name/status
            $('.datagrid').eq(0).find('tr').each(function () {
                const property = $(this).find('td')

                if (property.eq(0).html() == 'Family:') species.family = property.eq(1).find('a').html()
                if (property.eq(0).html() == 'Common Name:') species.commonName = property.eq(1).html()
                if (property.eq(0).html() == 'Status:') species.status = property.eq(1).find('span').html()

            })

            // specimens
            const specimens = []

            $('#specdist~div tbody tr').each(function () {
                const properties = $(this).find('td')

                specimens.push({
                    species: species._id,
                    country: properties.eq(0).html(),
                    state: properties.eq(1).html(),
                    county: properties.eq(2).html(),
                    date: Date.parse(properties.eq(3).html()) || 1,
                    specimen: properties.eq(4).html(),
                    note: properties.eq(5).html(),
                    imgUrl: properties.eq(6).find('a').attr('href')
                })

            })

            // if (specimens.length > 0) {

            Species.updateSpecies(species, specimens)

            // }


        })

    }

    let index = 0;
    let delay = 1000;

    // load new species from db
    Species.readNewSpecies().then(speciesList => {

        const numOfNewSpecies = speciesList.length

        debug(`Updating ${numOfNewSpecies} species...`)

        function updateMultipleSpecies() {

            updateSpecies(speciesList[index++])

            if (index < speciesList.length) setTimeout(updateMultipleSpecies, delay)

            if (index % 10 === 0) debug(`${index + 1}/${numOfNewSpecies} updated`)

        }

        updateMultipleSpecies()

    })



}


/* 
 * download img
 */
function downloadAllImages() {

    const batchSize = 500
    const concurrenceLimit = 5

    let batch
    let actualBatchSize = 0
    let concurrentCount = 0
    let finishedCount = 0

    function downloadBatch(size) {
        // get pending specimen batch
        Species.readPendingSpecimenBatch(size).then(data => {
            batch = data
            actualBatchSize = batch.length

            debug(`downloading batch of ${actualBatchSize} specimens`)

            // set the first download task
            downloadImage(0)

        })

    }

    function downloadImage(index) {

        // console.log(index)

        const specimen = batch[index],
            imgPath = specimen.imgUrl,
            speciesScientificName = specimen.species.scientificName,
            imgName = imgPath.split('/')[4]

        concurrentCount++

        // console.log(`start to download ${imgName}`)

        // download and save image
        downloadAndSaveFile(imgPath, `${speciesScientificName}-${imgName}`).then(() => {
            // console.log(`${imgName} downloaded`)
            // update
            specimen.progress = 'FULFILLED'

            Species.updateSpecimen(specimen).then(() => {
                // console.log(`${imgName} updated`)

                finishedCount++
                concurrentCount--

                next(index)

                if (finishedCount % 10 === 0) debug(`${finishedCount}/${actualBatchSize} downloaded`)

                // set next batch task 
                if (finishedCount === actualBatchSize) {
                    actualBatchSize = 0
                    finishedCount = 0

                    setTimeout(() => downloadBatch(batchSize), 1000)
                }

            })

        })

        next(index)
        
    }
    
    function next(index) {
        
        // set next download task
        if (index < actualBatchSize - 1 && concurrentCount < concurrenceLimit) setTimeout(() => { downloadImage(index+1) }, 1000)

    }

    downloadBatch(batchSize)

}



// saveSpecies()
// updateInfo()
downloadAllImages()
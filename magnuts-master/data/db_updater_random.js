var mongojs = require('mongojs')

var uri = "mongodb://localhost/testdb",
    db = mongojs.connect(uri, ["test"])
var lifeArray = [14, 30, 180, 365]
var nlArray = [2000000, 2000001, 2010000, 2010001, 3000000]
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

function addLife(lifeArray) {
    db.test.find(function(err, docs) {
        if (err) {
            console.log('Error!')
            return
        }
        i = docs.length
        while (i--) {
            life = lifeArray[randomInt(0, 4)]
            db.test.update({
                "_id": docs[i]._id
            }, {
                $set: {
                    "life": life
                }
            })
        }
    })
}

function addNutritionLabel() {
    db.test.find(function(err, docs) {
        if (err) {
            console.log('Error!')
            return
        }
        i = docs.length
        while (i--) {
            nl = nlArray[randomInt(0, 5)]
            db.test.update({
                "_id": docs[i]._id
            }, {
                $set: {
                    "categoryId": nl
                }
            })
        }
    })
}

//addLife(lifeArray)
addNutritionLabel(nlArray)

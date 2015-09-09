var mongojs = require('mongojs'),
    getSpec = require('get_spec.js')

var uri = 'mongodb://localhost/testdb',
    db = mongojs.connect(uri, ['uh', 'test', 'nl'])

var uid = parseInt(process.argv[2]),
    nutrient = process.argv[3],
    timeStart = parseInt(process.argv[4]),
    timeEnd = parseInt(process.argv[5])

function counter(times, timeStart, timeEnd) {
    num = 0
    times.forEach(function(element) {
            //console.log(element);
            if (element.timeIn < timeEnd && element.timeOut > timeStart){
                num++
            }
        })
console.log('The count is: ' + num);
return num
}

function evaluateScore(err, count, spec, nc, nrv) {
    //console.log(count, spec, nc, nrv);
    i = count.length
    result = 0
    if (spec.length != i || nc.length != i) {
        console.log('Error2!');
        return
    }
    numerater = 0
    denominator = 0
    while (i--) {
        numberater += count * spec / 100 * nc
        denominator += count * spec / 100
    }
    denominator *= nrv
    result = numerater / denominator
    return result
}


function getNutrientScore(uid, nutrient, timeStart, timeEnd, callback) {
    //Array that stores count of each food
    count = []
    //Array that store the amount intaken of each food
    spec = []
    //Array that stores nutrient concentration of each food
    nc = []
    //Nutrition Reference Value
    nrv = 0
    nutrientScore = 0
    var uhs = []
    db.uh.find({
        'uid': uid
    }, function(err, uhs) {
        if (err) {
            console.log('Error0!');
            return callback(err)
            return
        } else if (uhs.length > 1) {
            console.log('Multiple Entries Found!');
            return
        }
        console.log('User Record Found!');
        db.nl.find({
            'categoryId': 1000005
        }, function(err, nls) {
            if (err) {
                console.log('Nutrition Label Not Found!');
                return callback(err)
                return
            } else if (nls.length > 1) {
                console.log('Multiple Entries Found!');
                return
            }
            //Nutrition Reference Value
            nrv = nls[0][nutrient]
            console.log('Nutrition Reference Value is: ' + nrv);
            i = uhs.length
            while (i--) {
                j = uhs[i].items.length
                console.log("The User Has Consumed " + j + " kinds of food!");
                while (j--) {
                    barcode = uhs[i].items[j].barcode
                    console.log('The Barcode is: ' + barcode);
                    count[j] = counter(uhs[i].items[j].times, timeStart, timeEnd)
                    getSpec(barcode, function(err, gds) {
                        if (err) {
                            console.log('Error1!');
                            return callback(err)
                            return
                        }
                        spec[j] = gds.total
                        console.log('The Specification of the Food is: ' + spec[j]);
                        console.log('The Specification of the Food is: ' + gds.total);
                        db.test.find({
                            'barcode': barcode
                        }, function(err, records) {
                            if (err) {
                                console.log('Food Not Found In Category');
                                return callback(err)
                                return
                            } else if (records.length > 1) {
                                console.log('Multiple Entries Found!');
                                return
                            }
                            //Category ID
                            cid = records[0].categoryId
                            console.log('The categoryId is: ' + cid);
                            db.nl.find({
                                'categoryId': cid
                            }, function(err, labels) {
                                if (err) {
                                    console.log('Nutrition Label Not Found!');
                                    return callback(err)
                                    return
                                } else if (labels.length > 1) {
                                    console.log('Multiple Entries Found!');
                                    return
                                }
                                nc[j] = labels[0][nutrient]
                                console.log('The Nutrition Concentration is: ' + nc[j]);
                            })
                        })
                    })
                }
            }

        })
    })
    return callback(null, count, spec, nc, nrv)
}

//getNutrientScore(uid, nutrient, timeStart, timeEnd)
getNutrientScore(100001, 'protein', 20140101, 20151231, evaluateScore)

//Counter Test
/*
time = [{
    "timeIn": 20150217,
    "timeOut": 20150317
}, {
    "timeIn": 20150224,
    "timeOut": 20150324
}, {
    "timeIn": 20150301,
    "timeOut": 20150331
}, {
    "timeIn": 20150331,
    "timeOut": 20150412
}, {
    "timeIn": 20150413,
    "timeOut": 20150431
}]
timeStart = 20150331
timeEnd = 20151231
counter(time, timeStart, timeEnd)
*/

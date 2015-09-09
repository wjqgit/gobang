var mongojs = require('mongojs')

var uri = 'mongodb://localhost/testdb',
    db = mongojs.connect(uri, ['test', 'nl'])

var barcode = parseInt(process.argv[2])

function getSpec(barcode, callback) {
    total = 0
    each = ''
    quantity = ''
    specs = {}
    db.test.find({
        'barcode': barcode
    }, function(err, docs) {
        if (err) {
            console.log('Error!')
            return callback(err)
        }
        i = docs.length
        itemFound = false
        while (i--) {
            spec = docs[i].spec
            itemFound = true
        }
        unit = spec.replace(/[^A-Za-z]/g, '')
        pos = spec.search(unit)
        l = spec.length
        for (i = 0; i < pos; i++) {
            each += spec[i]
        }
        switch (unit) {
            case 'g':
                for (i = pos + 2; i < l; i++) {
                    quantity += spec[i]
                }
                break;
            case 'ml':
                for (i = pos + 3; i < l; i++) {
                    quantity += spec[i]
                }
                break;
            default:
                console.log('Unit Not Defined!');
                break;
        }
        each = parseFloat(each)
        quantity = parseInt(quantity)
        total = each * quantity
        specs = {
            'total': total,
            'unit': unit,
            'each': each,
            'quantity': quantity
        }
        callback(null, specs)
    })
    return specs
}

//Option 1

getSpec(6942980800260, function /*logResult*/(err, doc){
    for(var key in doc){
        console.log(key + ': '+ doc[key]);
    }
})

//Option 2
/*
getSpec(6942980800260, function logResult(err, doc){
    for(var key in doc){
        console.log(key + ': '+ specs[key]);
    }
})
*/
//Option 3
/*
function logResult(err, doc){
    for(var key in doc){
        console.log(key + ': '+ specs[key]);
    }
}
getSpec(6942980800260, logResult)
*/
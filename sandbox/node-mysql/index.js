const mysql = require('mysql')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'kovan',
    password: 'test123',
    database: 'smlt_source'
})


pool.getConnection((err, connection) => {
    if (err) throw err

    const query = connection.query('select * from STATION')

    query
        .on('error', err => { if (err) throw err }
        )
        .on('fields', fields => fields.forEach(field => console.log(field.name))
        )
        .on('result', row => console.log(row.STATION_ID)
        )
        .on('end', () => console.log('end of query'))

    connection.release()

})


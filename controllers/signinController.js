const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)

exports.user = async (req, res) => {
    dbConn.query('SELECT * FROM users', function( err, results ) {
        res.send(results)
    })
}
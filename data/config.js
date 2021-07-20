const sql = require('mssql');

// Configuration object for database credentials
var config = {
    user: 'hqb',
    password: 'hqb',
    server: '185.108.128.212',
    database: 'hqBusiness',
    port: 2020,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Creating connection pool to be used by routes connecting SQL Server
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
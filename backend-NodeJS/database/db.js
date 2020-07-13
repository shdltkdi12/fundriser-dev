const mysql = require('mysql2');
const pool = mysql.createPool({
  host: '172.17.0.1',
  user: 'admin',
  password: '',
  database: 'fundriser',
  connectionLimit: 10,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true
});
module.exports = pool;
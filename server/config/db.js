// ---------------------------------------------------------------------
// MySQL connection pool
// Railway MySQL environment variables are used here.
// ---------------------------------------------------------------------

const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("MYSQLHOST VALUE:", process.env.MYSQLHOST);
console.log("MYSQLUSER VALUE:", process.env.MYSQLUSER);

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Quick startup check
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log('✅ MySQL connected successfully');

    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection,
};
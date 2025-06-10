const mysql = require("mysql2")
require("dotenv").config()
async function connect() {
    const connection = await mysql.createPool({
        uri: process.env.MYSQL_URI,
    });

    const pool = connection.promise();
    return pool;
}

module.exports = connect;
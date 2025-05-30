const { Sequelize } = require("sequelize");
require("dotenv").config()


const db = new Sequelize(process.env.MYSQL_URI)

module.exports = db
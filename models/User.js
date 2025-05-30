const { DataTypes } = require("sequelize");
const db = require("../sequelize/config.js")

const User = db.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datetime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = User;
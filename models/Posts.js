const { DataTypes } = require("sequelize");
const db = require("../sequelize/config.js");

const Posts = db.define("Posts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    post_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datetime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    post_like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

module.exports = Posts;
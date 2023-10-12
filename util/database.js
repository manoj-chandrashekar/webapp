const Sequelize = require('sequelize');
require('dotenv').config();

// const databaseName = process.env.NODE_ENV === 'test' ? 'test_webapp' : 'webapp';
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(process.env.DB_NAME, username, password, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

module.exports = sequelize;
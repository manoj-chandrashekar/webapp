const Sequelize = require('sequelize');
require('dotenv').config();

// const databaseName = process.env.NODE_ENV === 'test' ? 'test_webapp' : 'webapp';
const username = "root";
const password = "NeuGr@d2022";

const sequelize = new Sequelize("webapp", username, password, {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
const Sequelize = require('sequelize');

// const databaseName = process.env.NODE_ENV === 'test' ? 'test_webapp' : 'webapp';
const username = 'root';
const password = 'NeuGr@d2022';

const sequelize = new Sequelize("webapp", username, password, {
    dialect: 'mariadb',
    host: '127.0.0.1'
});

module.exports = sequelize;

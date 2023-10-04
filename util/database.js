const Sequelize = require('sequelize');

// const databaseName = process.env.NODE_ENV === 'test' ? 'test_webapp' : 'webapp';

const sequelize = new Sequelize("webapp", "root", "NeuGr@d2022", {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

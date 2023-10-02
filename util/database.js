const Sequelize = require('sequelize');

const sequelize = new Sequelize("webapp", "root", "NeuGr@d2022", {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

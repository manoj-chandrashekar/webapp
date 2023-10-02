const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        readOnly: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        writeOnly: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'account_created', // Custom column name for createdAt
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'account_updated', // Custom column name for updatedAt
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
});

module.exports = Account;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        readOnly: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        },
    },
    num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        },
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'assignment_created', // Custom column name for createdAt
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'assignment_updated', // Custom column name for updatedAt
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
});

module.exports = Assignment;

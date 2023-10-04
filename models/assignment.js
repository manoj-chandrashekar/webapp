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
    assignment_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
    assignment_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
}, {
    createdAt: 'assignment_created',
    updatedAt: 'assignment_updated',
});

module.exports = Assignment;

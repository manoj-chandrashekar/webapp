const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        readOnly: true,
    },
    assignment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        readOnly: true,
        references: {
            model: 'Assignments', 
            key: 'id',
        },
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true, 
        },
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
    submission_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        readOnly: true,
    },
}, {
    createdAt: 'submission_date',
    updatedAt: 'submission_updated',
});

module.exports = Submission;

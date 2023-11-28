const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Account = require('./account');
const Assignment = require('./assignment');

const UserAssignment = sequelize.define('UserAssignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        readOnly: true,
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: 'Accounts',
            key: 'id',
        },
        allowNull: false,
    },
    assignment_id: {
        type: DataTypes.UUID,
        references: {
            model: 'Assignments',
            key: 'id',
        },
        allowNull: false,
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

// Associations
Account.hasMany(UserAssignment, { foreignKey: 'user_id' });
UserAssignment.belongsTo(Account, { foreignKey: 'user_id' });

Assignment.hasMany(UserAssignment, { foreignKey: 'assignment_id' });
UserAssignment.belongsTo(Assignment, { foreignKey: 'assignment_id' });

module.exports = UserAssignment;

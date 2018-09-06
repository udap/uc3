const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const fees = sequelize.define('fees', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    destination: {
        type: Sequelize.STRING,
        field: 'destination'
    },
    methodId: {
        type: Sequelize.STRING,
        field: 'method_id'
    },
    fees: {
        type: Sequelize.STRING,
        field: 'fees'
    },
    memo: {
        type: Sequelize.STRING,
        field: 'memo'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = fees;





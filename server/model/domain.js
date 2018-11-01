const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const domain = sequelize.define('domain_name', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    gid: {
        type: Sequelize.STRING,
        field: 'gid'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    txHash: {
        type: Sequelize.STRING,
        field: 'tx_hash'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = domain;





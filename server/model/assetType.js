const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const assetType = sequelize.define('asset_type', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    gid: {
        type: Sequelize.STRING,
        field: 'gid'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    metadata: {
        type: Sequelize.STRING,
        field: 'metadata'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    symbol: {
        type: Sequelize.STRING,
        field: 'symbol'
    },
    txHash: {
        type: Sequelize.STRING,
        field: 'tx_hash'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = assetType;





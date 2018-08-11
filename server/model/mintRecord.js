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
    typeAddr: {
        type: Sequelize.STRING,
        field: 'type_addr'
    },
    to: {
        type: Sequelize.STRING,
        field: 'to'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    desc: {
        type: Sequelize.STRING,
        field: 'desc'
    },
    image: {
        type: Sequelize.STRING,
        field: 'image'
    },
    owner: {
        type: Sequelize.STRING,
        field: 'owner'
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

module.exports = assetType;





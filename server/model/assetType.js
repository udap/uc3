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
    icon: {
        type: Sequelize.STRING,
        field: 'icon'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    symbol: {
        type: Sequelize.STRING,
        field: 'symbol'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = Airdrop;





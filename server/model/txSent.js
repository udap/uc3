const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const txSent = sequelize.define('tx_sent', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    gid: {
        type: Sequelize.STRING,
        field: 'gid'
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
    },
    from: {
        type: Sequelize.STRING,
        field: 'from'
    },
    to: {
        type: Sequelize.STRING,
        field: 'to'
    },
    value: {
        type: Sequelize.STRING,
        field: 'value'
    },
    gasPrice: {
        type: Sequelize.STRING,
        field: 'gas_price'
    },
    gasLimit: {
        type: Sequelize.STRING,
        field: 'gas_limit'
    },
    gasUsed: {
        type: Sequelize.STRING,
        field: 'gas_used'
    },
    txCost: {
        type: Sequelize.STRING,
        field: 'tx_cost'
    },
    txFee: {
        type: Sequelize.STRING,
        field: 'tx_fee'
    },
    nonce: {
        type: Sequelize.STRING,
        field: 'nonce'
    },
    data: {
        type: Sequelize.STRING,
        field: 'data'
    },
    bizType: {
        type: Sequelize.STRING,
        field: 'biz_type'
    },
    bizId: {
        type: Sequelize.STRING,
        field: 'biz_id'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = txSent;





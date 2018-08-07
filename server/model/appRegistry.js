const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const appRegistry = sequelize.define('app_registry', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    gid: {
        type: Sequelize.STRING,
        field: 'gid'
    },
    desc: {
        type: Sequelize.STRING,
        field: 'desc'
    }
},{freezeTableName:true,updatedAt: 'create_time',updatedAt:'update_time'});

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#timestamps
module.exports = User;





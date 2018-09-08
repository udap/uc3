const sequelize = require('../data/db');
const Sequelize = require('sequelize');

const fees = sequelize.define('view_template', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    typeId: {
        type: Sequelize.BIGINT,
        field: 'type_id'
    },
    key: {
        type: Sequelize.STRING,
        field: 'key'
    },
    context:{
        type: Sequelize.STRING,
        field: 'context'
    },
    templateUri: {
        type: Sequelize.STRING,
        field: 'template_uri'
    }
},{freezeTableName:true,createdAt: 'create_time',updatedAt:'update_time'});

module.exports = fees;





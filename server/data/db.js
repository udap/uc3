const Sequelize = require('sequelize');
const mysqlConfig = require('../configs/mysql-config');


const sequelize = new Sequelize(mysqlConfig.dbname, mysqlConfig.uname, mysqlConfig.upwd, {
    host: mysqlConfig.host,
    dialect: mysqlConfig.dialect,
    operatorsAliases: false,
    pool: mysqlConfig.pool
});
module.exports = sequelize;
var config = {
    dbname: 'udap',
    uname: 'root',
    upwd: 'xinongeth',
    host: '47.104.225.39',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 15,
        min: 2,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = config;
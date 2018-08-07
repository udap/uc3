var config = {
    dbname: 'test',
    uname: 'root',
    upwd: '123456',
    host: 'localhost',
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
/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 15:30:27
 */

require('dotenv').config();

const {
    DB_HOST = 'server-mysql',
    DB_USER = 'root',
    DB_PASS = '123456789',
    DB_NAME = 'api',
    NODE_ENV = 'development'
} = process.env;

module.exports = {
    development: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        host: DB_HOST,
        dialect: 'mysql',
        logging: false,
        seederStorage: 'sequelize',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    test: {
        username: DB_USER,
        password: DB_PASS,
        database: `${DB_NAME}_test`,
        host: DB_HOST,
        dialect: 'mysql',
        logging: false
    },
    production: {
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        host: DB_HOST,
        dialect: 'mysql',
        logging: false
    }
};
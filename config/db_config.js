/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 29/10/25
 * @time 22:40:58
 */

require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    dialect: 'mysql',
    pool: {
        max: 5, min: 0, acquire: 30000, idle: 10000
    }
};
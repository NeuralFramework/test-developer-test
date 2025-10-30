/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 29/10/25
 * @time 22:53:30
 */
const {errorLogger} = require('../utils/logger');

const errorHandler = (err, req, res, next) => {

    errorLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl}`);
    res.status(err.status || 500).json({message: err.message || 'Error interno del servidor'});
};

module.exports = {errorHandler};
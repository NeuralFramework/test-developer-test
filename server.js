/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 29/10/25
 * @time 23:10:28
 */
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const {logger, errorLogger} = require('./utils/logger');
const {errorHandler} = require('./middlewares/error');

const app = express();

app.use(morgan('combined', {stream: {write: msg => logger.info(msg.trim())}}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth_routes'));
app.use('/api/usuarios', require('./routes/usuario_routes'));
app.use('/api/productos', require('./routes/producto_routes'));
app.use('/api/compras', require('./routes/compra_routes'));

app.use(errorHandler);
app.use((err, req, res, next) => {
    errorLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Servidor ejecutandose en el puerto ${PORT}`));
/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 23:24:00
 */

require('dotenv').config();

const express = require('express');
const {logger} = require("./utils/logger");
const app = express();

app.use(express.static(__dirname + '/apidoc'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/apidoc/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Servidor de Documentación ejecutandose en el puerto ${PORT}`));
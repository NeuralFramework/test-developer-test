/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:50:43
 */

const express = require('express');
const router = express.Router();
const compraCtrl = require('../controllers/compra_controller');
const { verifyToken, isAdmin } = require('../middlewares/auth_middleware');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate_middleware');

// Cliente
router.use(verifyToken);

router.post('/',
    [body('productos').isArray({ min: 1 }), body('productos.*.productoId').isInt(), body('productos.*.cantidad').isInt({ min: 1 })],
    validate,
    compraCtrl.realizarCompra
);

router.get('/factura/:id',
    [param('id').isInt()],
    validate,
    compraCtrl.getFactura
);

router.get('/historial', compraCtrl.getHistorial);

// Admin
router.get('/', isAdmin, compraCtrl.getAllCompras);

module.exports = router;
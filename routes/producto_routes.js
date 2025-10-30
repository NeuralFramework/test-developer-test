/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:24:04
 */

const express = require('express');
const router = express.Router();
const productoCtrl = require('../controllers/producto_controller');
const { verifyToken, isAdmin } = require('../middlewares/auth_middleware');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate_middleware');

router.use(verifyToken, isAdmin);

router.get('/', productoCtrl.getAll);
router.get('/:id', [param('id').isInt()], validate, productoCtrl.getById);
router.post('/',
    [
        body('lote').notEmpty(),
        body('nombre').notEmpty(),
        body('precio').isFloat({ min: 0 }),
        body('cantidad').isInt({ min: 0 })
    ],
    validate,
    productoCtrl.create
);
router.put('/:id',
    [param('id').isInt()],
    validate,
    productoCtrl.update
);
router.delete('/:id',
    [param('id').isInt()],
    validate,
    productoCtrl.delete
);

module.exports = router;
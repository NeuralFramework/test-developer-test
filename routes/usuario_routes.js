/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:38:05
 */

const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario_controller');
const { verifyToken, isAdmin } = require('../middlewares/auth_middleware');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate_middleware');

// Proteger todas las rutas
router.use(verifyToken, isAdmin);

router.get('/', usuarioCtrl.getAll);

router.get('/:id',
    [param('id').isInt()],
    validate,
    usuarioCtrl.getById
);

router.post('/',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 5 }).withMessage('Contraseña mínima 5 caracteres'),
        body('nombre').notEmpty().withMessage('Nombre requerido'),
        body('rol').isIn(['Administrador', 'Cliente']).withMessage('Rol inválido')
    ],
    validate,
    usuarioCtrl.create
);

router.put('/:id',
    [param('id').isInt()],
    validate,
    usuarioCtrl.update
);

router.delete('/:id',
    [param('id').isInt()],
    validate,
    usuarioCtrl.delete
);

module.exports = router;
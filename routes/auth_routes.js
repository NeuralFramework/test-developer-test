/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 16:57:50
 */

const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth_controller');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate_middleware');

router.post('/login',
    [body('email').isEmail(), body('password').isLength({ min: 5 })],
    validate,
    authCtrl.login
);

router.post('/register',
    [body('email').isEmail(), body('password').isLength({ min: 5 }), body('nombre').notEmpty(), body('rol').isIn(['Administrador','Cliente'])],
    validate,
    authCtrl.register
);

module.exports = router;
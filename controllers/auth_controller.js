/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 16:48:45
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usuario } = require('../models');
const { errorLogger } = require('../utils/logger');

/**
 * Login inicial
 *
 * @api {post} /api/auth/login
 * @apiName Login
 * @apiGroup Auth
 * @apiParam {String} email
 * @apiParam {String} password
 * @apiSuccess {String} token JWT
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usuario.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token });
    } catch (err) {
        errorLogger.error(err.message);
        res.status(500).json({ message: 'Error en login' });
    }
};

/**
 * Registro de pruebas
 *
 * @api {post} /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { email, password, nombre, rol } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await usuario.create({ email, password: hashed, nombre, rol });
        res.status(201).json({ id: user.id, email: user.email, rol: user.rol });
    } catch (err) {
        errorLogger.error(err.message);
        console.log(err)
        res.status(400).json({ message: err.errors?.[0]?.message || 'Error al registrar' });
    }
};
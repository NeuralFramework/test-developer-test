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
 * @api {post} /api/auth/login Iniciar sesión
 * @apiName LoginUsuario
 * @apiGroup Autenticación
 * @apiDescription Autentica a un usuario y devuelve un JWT.
 *
 * @apiBody {String} email Correo electrónico del usuario.
 * @apiBody {String} password Contraseña (mínimo 5 caracteres).
 *
 * @apiSuccess {String} token Token JWT para autenticación.
 * @apiSuccessExample {json} Éxito
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *    }
 *
 * @apiError (401) CredencialesInválidas Email o contraseña incorrectos.
 * @apiError (500) ErrorServidor Error interno al procesar la solicitud.
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
 * @api {post} /api/auth/register Registrar usuario
 * @apiName RegistrarUsuario
 * @apiGroup Autenticación
 * @apiDescription Crea un nuevo usuario (solo para pruebas o admin).
 *
 * @apiBody {String} email Correo electrónico único.
 * @apiBody {String} password Contraseña (mínimo 5 caracteres).
 * @apiBody {String} nombre Nombre completo.
 * @apiBody {String="Administrador","Cliente"} rol Rol del usuario.
 *
 * @apiSuccess {Number} id ID del usuario creado.
 * @apiSuccess {String} email Email del usuario.
 * @apiSuccess {String} rol Rol asignado.
 *
 * @apiSuccessExample {json} Éxito
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 3,
 *      "email": "nuevo@ejemplo.com",
 *      "rol": "Cliente"
 *    }
 *
 * @apiError (400) ValidacionFallida Datos inválidos.
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
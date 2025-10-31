/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:37:28
 */

const { Usuario } = require('../models');
const { errorLogger } = require('../utils/logger');
const bcrypt = require('bcryptjs');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

/**
 * @api {get} /api/usuarios Listar usuarios
 * @apiName ListarUsuarios
 * @apiGroup Usuarios
 * @apiPermission Administrador
 * @apiDescription Obtiene todos los usuarios (sin contraseña).
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiSuccess {Object[]} usuarios Lista de usuarios.
 * @apiSuccess {Number} usuarios.id ID del usuario.
 * @apiSuccess {String} usuarios.email Email.
 * @apiSuccess {String} usuarios.nombre Nombre.
 * @apiSuccess {String} usuarios.rol Rol.
 *
 * @apiSuccessExample {json} Éxito
 *    HTTP/1.1 200 OK
 *    [{ "id": 1, "email": "admin@...", "nombre": "Admin", "rol": "Administrador" }]
 *
 * @apiError (403) AccesoDenegado Solo administradores.
 */
exports.getAll = wrap(async (req, res) => {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'email', 'nombre', 'rol'] });
    res.json(usuarios);
});

/**
 * @api {get} /api/usuarios/:id Obtener usuario por ID
 * @apiName ObtenerUsuario
 * @apiGroup Usuarios
 * @apiPermission Administrador
 *
 * @apiParam {Number} id ID del usuario.
 *
 * @apiSuccess {Object} usuario Datos del usuario.
 *
 * @apiError (404) NoEncontrado Usuario no existe.
 */
exports.getById = wrap(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'email', 'nombre', 'rol'] });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
});

/**
 * @api {post} /api/usuarios Crear usuario
 * @apiName CrearUsuario
 * @apiGroup Usuarios
 * @apiPermission Administrador
 *
 * @apiBody {String} email
 * @apiBody {String} password
 * @apiBody {String} nombre
 * @apiBody {String} rol
 *
 * @apiSuccess (201) {Object} usuario Usuario creado.
 */
exports.create = wrap(async (req, res) => {
    const { email, password, nombre, rol } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ email, password: hashed, nombre, rol });
    res.status(201).json({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
    });
});

/**
 * @api {put} /api/usuarios/:id Actualizar usuario
 * @apiName ActualizarUsuario
 * @apiGroup Usuarios
 * @apiPermission Administrador
 *
 * @apiBody {String} [password] Nueva contraseña (opcional).
 */
exports.update = wrap(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    await usuario.update(req.body);
    res.json({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
    });
});

/**
 * @api {delete} /api/usuarios/:id Eliminar usuario
 * @apiName EliminarUsuario
 * @apiGroup Usuarios
 * @apiPermission Administrador
 *
 * @apiSuccess (204) NoContent Usuario eliminado.
 */
exports.delete = wrap(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    await usuario.destroy();
    res.status(204).send();
});
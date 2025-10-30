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
 * @apiName GetUsuarios
 * @apiGroup Usuario
 * @apiSuccess {Object[]} usuarios Lista de usuarios
 */
exports.getAll = wrap(async (req, res) => {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'email', 'nombre', 'rol'] });
    res.json(usuarios);
});

/**
 * @api {get} /api/usuarios/:id Obtener usuario
 * @apiName GetUsuario
 * @apiGroup Usuario
 * @apiParam {Number} id ID del usuario
 */
exports.getById = wrap(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'email', 'nombre', 'rol'] });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
});

/**
 * @api {post} /api/usuarios Crear usuario (solo Admin)
 * @apiName CreateUsuario
 * @apiGroup Usuario
 * @apiParam {String} email Email
 * @apiParam {String} password Contraseña
 * @apiParam {String} nombre Nombre
 * @apiParam {String="Administrador","Cliente"} rol Rol
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
 * @api {put} /api/usuarios/:id Actualizar usuario (solo Admin)
 * @apiName UpdateUsuario
 * @apiGroup Usuario
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
 * @api {delete} /api/usuarios/:id Eliminar usuario (solo Admin)
 * @apiName DeleteUsuario
 * @apiGroup Usuario
 */
exports.delete = wrap(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    await usuario.destroy();
    res.status(204).send();
});
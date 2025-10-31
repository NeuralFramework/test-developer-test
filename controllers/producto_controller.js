/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:13:08
 */

const { producto } = require('../models');
const { errorLogger } = require('../utils/logger');

/** CRUD Productos (solo Admin) */
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

/**
 * @api {get} /api/productos Listar productos
 * @apiName ListarProductos
 * @apiGroup Productos
 * @apiPermission Administrador
 *
 * @apiSuccess {Object[]} productos Lista de productos en inventario.
 * @apiSuccess {Number} productos.id
 * @apiSuccess {String} productos.lote
 * @apiSuccess {String} productos.nombre
 * @apiSuccess {Number} productos.precio
 * @apiSuccess {Number} productos.cantidad
 * @apiSuccess {Date} productos.fechaIngreso
 */
exports.getAll = wrap(async (req, res) => {
    const productos = await producto.findAll();
    res.json(productos);
});

/**
 * @api {get} /api/productos/:id Obtener producto
 * @apiName ObtenerProducto
 * @apiGroup Productos
 * @apiPermission Administrador
 */
exports.getById = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(productos);
});

/**
 * @api {post} /api/productos Crear producto
 * @apiName CrearProducto
 * @apiGroup Productos
 * @apiPermission Administrador
 *
 * @apiBody {String} lote Número de lote único.
 * @apiBody {String} nombre Nombre del producto.
 * @apiBody {Number} precio Precio unitario.
 * @apiBody {Number} cantidad Cantidad inicial.
 * @apiBody {String} [fechaIngreso] Fecha de ingreso (ISO).
 *
 * @apiSuccess (201) {Object} producto Producto creado.
 */
exports.create = wrap(async (req, res) => {
    const { lote, nombre, precio, cantidad, fechaIngreso } = req.body;
    const productos = await producto.create({ lote, nombre, precio, cantidad, fechaIngreso });
    res.status(201).json(productos);
});

/**
 * @api {put} /api/productos/:id Actualizar producto
 * @apiName ActualizarProducto
 * @apiGroup Productos
 * @apiPermission Administrador
 */
exports.update = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    await productos.update(req.body);
    res.json(productos);
});

/**
 * @api {delete} /api/productos/:id Eliminar producto
 * @apiName EliminarProducto
 * @apiGroup Productos
 * @apiPermission Administrador
 *
 * @apiSuccess (204) NoContent Producto eliminado.
 */
exports.delete = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    await productos.destroy();
    res.status(204).send();
});
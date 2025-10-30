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

exports.getAll = wrap(async (req, res) => {
    const productos = await producto.findAll();
    res.json(productos);
});

exports.getById = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(productos);
});

exports.create = wrap(async (req, res) => {
    const { lote, nombre, precio, cantidad, fechaIngreso } = req.body;
    const productos = await producto.create({ lote, nombre, precio, cantidad, fechaIngreso });
    res.status(201).json(productos);
});

exports.update = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    await productos.update(req.body);
    res.json(productos);
});

exports.delete = wrap(async (req, res) => {
    const productos = await producto.findByPk(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    await productos.destroy();
    res.status(204).send();
});
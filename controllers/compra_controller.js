/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 17:39:49
 */

const { compra, detalleCompra, producto, usuario } = require('../models');
const { errorLogger } = require('../utils/logger');
const { Op } = require('sequelize');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

/** Cliente: Realizar compra */
exports.realizarCompra = wrap(async (req, res) => {
    const { productos } = req.body; // [{productoId, cantidad}]
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ message: 'Productos requeridos' });
    }

    const ids = productos.map(p => p.productoId);
    const prods = await producto.findAll({ where: { id: ids } });
    if (prods.length !== ids.length) return res.status(404).json({ message: 'Producto no encontrado' });

    let total = 0;
    const detalles = [];

    for (const item of productos) {
        const prod = prods.find(p => p.id === item.productoId);
        if (prod.cantidad < item.cantidad) return res.status(400).json({ message: `Stock insuficiente para ${prod.nombre}` });
        const subtotal = prod.precio * item.cantidad;
        total += subtotal;
        detalles.push({ productoId: prod.id, cantidad: item.cantidad, precioUnitario: prod.precio });
        prod.cantidad -= item.cantidad;
        await prod.save();
    }

    const compras = await compra.create({ usuarioId: req.user.id, total });
    for (const d of detalles) {
        await detalleCompra.create({ ...d, compraId: compras.id });
    }

    res.status(201).json({ compraId: compras.id, total });
});

/** Cliente: Ver factura */
exports.getFactura = wrap(async (req, res) => {
    const compras = await compra.findByPk(req.params.id, {
        include: [
            { model: detalleCompra, include: [producto] },
            { model: usuario, attributes: ['nombre', 'email'] }
        ]
    });
    if (!compras || compras.usuarioId !== req.user.id) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(compra);
});

/** Cliente: Historial */
exports.getHistorial = wrap(async (req, res) => {
    const compras = await compra.findAll({
        where: { usuarioId: req.user.id },
        include: [{ model: detalleCompra, include: [producto] }]
    });
    res.json(compras);
});

/** Admin: Ver todas las compras */
exports.getAllCompras = wrap(async (req, res) => {
    const compras = await compra.findAll({
        include: [
            { model: usuario, attributes: ['nombre', 'email'] },
            { model: detalleCompra, include: [producto] }
        ]
    });
    res.json(compras);
});
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

/**
 * @api {post} /api/compras Realizar compra
 * @apiName RealizarCompra
 * @apiGroup Compras
 * @apiPermission Cliente
 * @apiDescription Crea una compra y actualiza el inventario.
 *
 * @apiBody {Object[]} productos Lista de productos a comprar.
 * @apiBody {Number} productos.productoId ID del producto.
 * @apiBody {Number} productos.cantidad Cantidad (mínimo 1).
 *
 * @apiSuccess {Number} compraId ID de la compra.
 * @apiSuccess {String} total Total de la compra.
 *
 * @apiSuccessExample {json} Éxito
 *    HTTP/1.1 201 Created
 *    { "compraId": 5, "total": "2476.50" }
 *
 * @apiError (400) StockInsuficiente No hay suficiente cantidad.
 * @apiError (404) ProductoNoEncontrado ID de producto inválido.
 */
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

/**
 * @api {get} /api/compras/factura/:id Ver factura
 * @apiName VerFactura
 * @apiGroup Compras
 * @apiPermission Cliente
 * @apiDescription Muestra la factura completa de una compra.
 *
 * @apiParam {Number} id ID de la compra.
 *
 * @apiSuccess {Object} compra Detalles completos.
 * @apiSuccess {Date} compra.fecha
 * @apiSuccess {String} compra.total
 * @apiSuccess {Object} compra.Usuario Cliente.
 * @apiSuccess {Object[]} compra.DetalleCompras Detalles.
 */
exports.getFactura = wrap(async (req, res) => {
    const compras = await compra.findByPk(req.params.id, {
        include: [
            { model: detalleCompra, include: [producto] },
            { model: usuario, attributes: ['nombre', 'email'] }
        ]
    });
    if (!compras || compras.usuarioId !== req.user.id) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(compras);
});

/**
 * @api {get} /api/compras/historial Historial de compras
 * @apiName HistorialCompras
 * @apiGroup Compras
 * @apiPermission Cliente
 * @apiDescription Lista todas las compras del usuario autenticado.
 */
exports.getHistorial = wrap(async (req, res) => {
    const compras = await compra.findAll({
        where: { usuarioId: req.user.id },
        include: [{ model: detalleCompra, include: [producto] }]
    });
    res.json(compras);
});

/**
 * @api {get} /api/compras Todas las compras (Admin)
 * @apiName TodasLasCompras
 * @apiGroup Compras
 * @apiPermission Administrador
 * @apiDescription Lista todas las compras del sistema.
 */
exports.getAllCompras = wrap(async (req, res) => {
    const compras = await compra.findAll({
        include: [
            { model: usuario, attributes: ['nombre', 'email'] },
            { model: detalleCompra, include: [producto] }
        ]
    });
    res.json(compras);
});
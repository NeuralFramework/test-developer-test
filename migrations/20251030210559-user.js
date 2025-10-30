'use strict';

const db = require('../models/index');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    const { usuario, producto, detalleCompra, compra } = db;

    await queryInterface.createTable(usuario.tableName, usuario.getAttributes());
    await queryInterface.createTable(producto.tableName, producto.getAttributes());
    await queryInterface.createTable(detalleCompra.tableName, detalleCompra.getAttributes());
    await queryInterface.createTable(compra.tableName, compra.getAttributes());

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    const { usuario, producto, detalleCompra, compra } = db;

    await queryInterface.dropTable(compra.tableName);
    await queryInterface.dropTable(detalleCompra.tableName);
    await queryInterface.dropTable(producto.tableName);
    await queryInterface.dropTable(usuario.tableName);

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
  }
};

'use strict';

const db = require('../models/index');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    // const { detalleCompra } = db;
    // await queryInterface.createTable(detalleCompra.tableName, detalleCompra.getAttributes());
  },

  async down (queryInterface, Sequelize) {

    // const { detalleCompra } = db;
    // await queryInterface.dropTable(detalleCompra.tableName);
  }
};

'use strict';

const db = require('../models/index');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    // const { producto } = db;
    // await queryInterface.createTable(producto.tableName, producto.getAttributes());
  },

  async down (queryInterface, Sequelize) {

    // const { producto } = db;
    // await queryInterface.dropTable(producto.tableName);
  }
};

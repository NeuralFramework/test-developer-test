'use strict';

const db = require('../models/index');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    // const { compra } = db;
    // await queryInterface.createTable(compra.tableName, compra.getAttributes());
  },

  async down (queryInterface, Sequelize) {

    // const { compra } = db;
    // await queryInterface.dropTable(compra.tableName);
  }
};

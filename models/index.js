const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db_config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.usuario = require('./user_model')(sequelize, Sequelize);
db.producto = require('./product_model')(sequelize, Sequelize);
db.compra = require('./buy_model')(sequelize, Sequelize);
db.detalleCompra = require('./detail_buy_model')(sequelize, Sequelize);


db.usuario.hasMany(db.compra, { foreignKey: 'usuarioId' });
db.compra.belongsTo(db.usuario, { foreignKey: 'usuarioId' });

db.compra.hasMany(db.detalleCompra, { foreignKey: 'compraId' });
db.detalleCompra.belongsTo(db.compra, { foreignKey: 'compraId' });

db.producto.hasMany(db.detalleCompra, { foreignKey: 'productoId' });
db.detalleCompra.belongsTo(db.producto, { foreignKey: 'productoId' });

module.exports = db;
/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 12:19:58
 */

module.exports = (sequelize, DataTypes) => {

    const Producto = sequelize.define('Producto', {
        lote: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            validate: { min: 0 }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },
        fechaIngreso: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, { timestamps: true });

    return Producto;
};
/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 12:45:04
 */

module.exports = (sequelize, DataTypes) => {

    const DetalleCompra = sequelize.define('DetalleCompra', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        },
        precioUnitario: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    }, { timestamps: false });

    return DetalleCompra;
};
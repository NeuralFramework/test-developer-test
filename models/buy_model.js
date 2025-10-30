/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 12:31:02
 */

module.exports = (sequelize, DataTypes) => {

    const Compra = sequelize.define('Compra', {
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        total: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        }
    }, { timestamps: false });

    return Compra;
};
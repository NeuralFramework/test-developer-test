/**
 * @fileoverview
 *
 * @author Carlos Parra <neural.framework@gmail.com>
 * @version 1.0.0
 * @date 30/10/25
 * @time 12:13:49
 */

/**
 * @apiDefine Usuario
 * @apiSuccess {Number} id
 * @apiSuccess {String} email
 * @apiSuccess {String} nombre
 * @apiSuccess {String="Administrador","Cliente"} rol
 */
module.exports = (sequelize, DataTypes) => {

    const Usuario = sequelize.define('Usuario', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('Administrador', 'Cliente'),
            allowNull: false,
            defaultValue: 'Cliente'
        }
    }, { timestamps: true });

    return Usuario;
};
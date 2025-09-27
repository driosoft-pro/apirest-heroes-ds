import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js'; 

// Definición del modelo Usuarios
export const Usuarios = sequelize.define('usuarios_ds', 
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM('ADMIN_ROLE', 'USER_ROLE'),
            allowNull: true,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        google: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        fecha_actualizacion: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },

    {
        //Maintain table name don't plurilize
        freezeTableName: true,
        // I don't want createdAt
        createdAt: false,
        // I don't want updatedAt
        updatedAt: false
    }
);

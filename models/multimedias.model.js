import { DataTypes } from 'sequelize';
import { bdmysql,bdmysqlNube } from '../database/connection.js'; 

// Definición del modelo Multimedias
export const Multimedias = bdmysql.define('multimedias_ds', {
    idmultimedia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});



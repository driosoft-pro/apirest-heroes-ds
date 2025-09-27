import { DataTypes } from 'sequelize';
import { bdmysql,bdmysqlNube } from '../database/connection.js'; 

// Definición del modelo Peliculas
export const Peliculas = bdmysql.define('peliculas_ds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});



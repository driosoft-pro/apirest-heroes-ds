import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connectionSQL.js'; 

// Definición del modelo Peliculas
export const Peliculas = sequelize.define('peliculas_ds', {
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



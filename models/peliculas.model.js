import { DataTypes } from 'sequelize';
import connection from '../database/connection';
const { bdmysql } = connection;

const Peliculas = bdmysql.define('peliculas_ds', {
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

export default {
    Peliculas
};

const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/connection');

const Peliculas = bdmysql.define('peliculas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    sinopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha_lanzamiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duracion: {
        type: DataTypes.INTEGER, // minutos
        allowNull: false,
    },
    genero: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

module.exports = { Peliculas };

const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/connection');

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

module.exports = { Peliculas };

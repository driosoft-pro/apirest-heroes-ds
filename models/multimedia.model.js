const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/connection');

const Multimedia = bdmysql.define('multimedia_ds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_heroe: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('imagen', 'video', 'pdf', 'documento'),
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

module.exports = { Multimedia };

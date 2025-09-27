import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Heroes = sequelize.define('heroes_ds',
    {
        // Model attributes are defined here
        'id': {
            type: DataTypes.INTEGER,
            //allowNull: false,
            primaryKey: true
        },
        'nombre': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'bio': {
            type: DataTypes.TEXT,
            allowNull: false
            // allowNull defaults to true
        },
        'img': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'aparicion': {
            type: DataTypes.DATE
            // allowNull defaults to true
        },
        'casa': {
            type: DataTypes.STRING
            // allowNull defaults to true
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
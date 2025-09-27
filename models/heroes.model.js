import { DataTypes } from 'sequelize';
import connection from '../database/connection';
const { bdmysql, bdmysqlNube } = connection;

//const Heroes = bdmysqlNube.define('heroes',
const Heroes = bdmysql.define('heroes',
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

export default {
    Heroes
};

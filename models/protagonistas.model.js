import { DataTypes } from 'sequelize';
import { bdmysql,bdmysqlNube } from '../database/connection.js'; 
import { Heroes } from './hero.model.js';
import { Peliculas } from './peliculas.model.js';

export const Protagonistas = bdmysql.define('protagonistas_ds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    papel: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fecha_participacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    heroes_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'heroes_ds', // nombre de la tabla referenciada en la BD
            key: 'id'
        }
    },
    peliculas_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'peliculas_ds', // nombre de la tabla referenciada en la BD
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});


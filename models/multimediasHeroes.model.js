import { DataTypes } from 'sequelize';
import { bdmysql,bdmysqlNube } from '../database/connection.js'; 

export const MultimediasHeroes = bdmysql.define('multimedias_heroes_ds', {
    heroes_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idmultimedia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});



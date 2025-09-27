import { DataTypes } from 'sequelize';
import connection from '../database/connection';
const { bdmysql } = connection;

const MultimediasHeroes = bdmysql.define('multimedias_heroes_ds', {
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

export default {
    MultimediasHeroes
};

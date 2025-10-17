import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connectionSQL.js';
import { Heroes } from './heroesSQL.model.js';
import { Multimedias } from './multimediasSQL.model.js';

// Definición del modelo MultimediasHeroes
export const MultimediasHeroes = sequelize.define('multimedias_heroe_ds', {
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

// RELACIONES
Heroes.belongsToMany(Multimedias, { through: MultimediasHeroes,foreignKey: 'heroes_id', otherKey: 'idmultimedia', as: 'multimedias'});

Multimedias.belongsToMany(Heroes, { 
    through: MultimediasHeroes,   
    foreignKey: 'idmultimedia', otherKey: 'heroes_id', as: 'heroes'
});

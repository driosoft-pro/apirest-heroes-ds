import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { Heroes } from './heroes.model.js';
import { Multimedias } from './multimedias.model.js';

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

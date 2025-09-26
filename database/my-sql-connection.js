const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para la BD local
const bdmysql = new Sequelize(
    process.env.DB_LOCAL_NAME,
    process.env.DB_LOCAL_USER,
    process.env.DB_LOCAL_PASSWORD,
    {
        host: process.env.DB_LOCAL_HOST,
        port: process.env.DB_LOCAL_PORT,
        dialect: process.env.DB_LOCAL_DIALECT
    }
);

// Configuración para la BD en la nube
const bdmysqlNube = new Sequelize(
    process.env.DB_REMOTE_NAME,
    process.env.DB_REMOTE_USER,
    process.env.DB_REMOTE_PASSWORD,
    {
        host: process.env.DB_REMOTE_HOST,
        port: process.env.DB_REMOTE_PORT,
        dialect: process.env.DB_REMOTE_DIALECT
    }
);

module.exports = { bdmysql, bdmysqlNube };

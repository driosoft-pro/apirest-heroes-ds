const express = require('express')
const cors = require('cors')

const { bdmysql, bdmysqlNube } = require('../database/connection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos desde la Clase...')
        });

        // Conexión BD
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async dbConnection() {
        try {
            //await bdmysqlNube.authenticate();
            await bdmysql.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL', error);
        }
    }

    routes() {
        // Carga del index de rutas
        this.app.use('/api', require('../routes/index')); 
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public')); // Directorio público
    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;

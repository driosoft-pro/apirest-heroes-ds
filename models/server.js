import express from 'express';
import cors from 'cors';
import { sequelize } from '../database/connectionSQL.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.app.get('/', function(req, res) {
            res.send('Hola Mundo desde javascript..')
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
            //await sequelizeNube.authenticate();
            await sequelize.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL', error);
        }
    }

    async routes() {
        // Carga del index de rutas
        const routes = (await import('../routes/index.js')).default;
        this.app.use('/api', routes);
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

export default Server;
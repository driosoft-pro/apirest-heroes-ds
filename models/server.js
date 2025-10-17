import express from 'express';
import cors from 'cors';
import { sequelize } from '../database/connectionSQL.js';
import { connectionNoSQL } from '../database/connectionNoSQL.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.app.get('/', (req, res) => {
            res.send('Hola Mundo desde javascript..');
        });

        // Conexión SQL
        this.connectionSQL();

        // Conexión NoSQL
        this.connectionMongo();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    //Conexión a MySQL (Sequelize)
    async connectionSQL() {
        try {
            await sequelize.authenticate();
            console.log('Conexión OK a MySQL.');
        } catch (error) {
            console.error('No se pudo conectar a la BD MySQL:', error);
        }
    }

    //Conexión a MongoDB (Mongoose)
    async connectionMongo() {
        try {
            await connectionNoSQL(); // llama a la función exportada
            console.log('Conexión OK a MongoDB.');
        } catch (error) {
            console.error('No se pudo conectar a la BD de MongoDB:', error);
        }
    }

    //Cargar rutas
    async routes() {
        const routes = (await import('../routes/index.js')).default;
        this.app.use('/api', routes);
    }

    //Middlewares
    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public')); // Directorio público
    }

    //Iniciar servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

export default Server;

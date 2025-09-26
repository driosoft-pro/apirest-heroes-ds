const express = require('express')
const cors = require('cors')
//const { bdmysql } = require('../database/MariaDbConnection');
const { bdmysql,bdmysqlNube } = require('../database/my-sql-connection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;     
        this.pathsMySql = {
            auth: '/api/auth',
            prueba: '/api/prueba',

            //PATH heroes
            heroes: '/api/heroes',

            //PATH usuarios
            usuarios: '/api/usuarios',
        }
        
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos desde la Clase...')
        })

        //Aqui me conecto a la BD
        this.dbConnection();

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    async dbConnection() {
        try {
            await bdmysqlNube.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL', error);
        }
    }


    routes() {
        //this.app.use(this.pathsMySql.auth, require('../routes/MySqlAuth'));

        //Aqui activo la ruta de HEROES
        this.app.use(this.pathsMySql.heroes, require('../routes/heroes.route'));

        //Aqui activo la ruta de USUARIOS
        this.app.use(this.pathsMySql.usuarios, require('../routes/usuarios.route'));
    }

  
    middlewares() {
        //CORS
        //Evitar errores por Cors Domain Access
        //Usado para evitar errores.
        this.app.use(cors());

        //Lectura y Parseo del body
        //JSON
       
        //JSON (JavaScript Object Notation)
        //es un formato ligero de intercambio de datos.
        //JSON es de fácil lectura y escritura para los usuarios.
        //JSON es fácil de analizar y generar por parte de las máquinas.
        //JSON se basa en un subconjunto del lenguaje de programación JavaScript,
        //Estándar ECMA-262 3a Edición - Diciembre de 1999.
       
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;
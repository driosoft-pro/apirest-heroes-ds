require('dotenv').config();

const Server = require('./models/server')

//Instancio la Clase
const server = new Server();

server.listen();


require('dotenv').config();

import Server from './models/server';

//Instancio la Clase
const server = new Server();

server.listen();

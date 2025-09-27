import dotenv from 'dotenv';
dotenv.config();

import Server from './models/server.js';

//Instancio la Clase
const server = new Server();

server.listen();

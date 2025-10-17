// database/connectionNoSQL.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoURI = '';
if ((process.env.DB_ENV || 'local').toLowerCase() === 'remote') {
  mongoURI = process.env.MONGODB_REMOTE_URI; // ej: mongodb+srv://user:pass@cluster/db
} else {
  mongoURI = process.env.MONGODB_LOCAL_URI; // ej: mongodb://localhost:27017/mi_basedatos
}

export const connectionNoSQL = async () => {
  try {
    if (!mongoURI) {
      throw new Error('Mongo URI no definido. Revisa MONGODB_LOCAL_URI/MONGODB_REMOTE_URI en .env');
    }
    await mongoose.connect(mongoURI);
    console.log('Base de datos MongoDB conectada correctamente...');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    throw new Error('Error al levantar la BD de MongoDB');
  }
};

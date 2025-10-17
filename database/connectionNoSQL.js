<<<<<<< HEAD
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoURI = '';

if (process.env.DB_ENV === 'remote') {
  mongoURI = process.env.MONGODB_REMOTE_URI; // ejemplo: mongodb+srv://user:pass@cluster.mongodb.net/dbname
} else {
  mongoURI = process.env.MONGODB_LOCAL_URI; // ejemplo: mongodb://localhost:27017/mi_basedatos
}

export const connectionNoSQL = async () => {
    try {
        await mongoose.connect(mongoURI, {
        // opciones modernas ya por defecto en Mongoose 7+
        // pero se pueden descomentar si usas una versión anterior
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });

        console.log('Base de datos MongoDB conectada correctamente...');
=======
import { connect } from 'mongoose'

export const dbConnectionMongo = async() => {
    try {
        await connect(process.env.MONGODB_CNN,{
            //useNewUrlParser: true,
            //useUnifiedTopology: true
            //useCreateIndex: true,
            //useFindAndModify: false
        })
        console.log('Base de Datos de Mongo online...')
       
>>>>>>> e7dd53f4a17ecc7585497f73b416e0a9a5418fb9
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        throw new Error('Error al levantar la BD de MongoDB');
    }
<<<<<<< HEAD
};
=======
   
}
>>>>>>> e7dd53f4a17ecc7585497f73b416e0a9a5418fb9

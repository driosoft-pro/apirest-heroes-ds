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
       
    } catch (error) {
        console.log(error)
        throw new Error('Error al levantar la BD de MongoDb...')
       
    }
   
}
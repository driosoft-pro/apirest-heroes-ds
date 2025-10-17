import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const ProtagonistaSchema = new Schema({
  papel: {
    type: String,
    required: false,
    trim: true,
  },
  fecha_participacion: {
    type: Date,
    required: false,
  },
  heroes_id: {
    type: Types.ObjectId,
    ref: 'Heroes',
    required: [true, 'El heroe es obligatorio'],
  },
  peliculas_id: {
    type: Types.ObjectId,
    ref: 'Peliculas',
    required: [true, 'La película es obligatoria'],
  },
}, {
  collection: 'protagonistas',
});

/** Remueve __v. Puedes añadir lógica para ocultar campos si hiciera falta. */
ProtagonistaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Protagonistas', ProtagonistaSchema);

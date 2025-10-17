import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PeliculaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: 50,
  },
}, {
  collection: 'peliculas',
});

PeliculaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Peliculas', PeliculaSchema);

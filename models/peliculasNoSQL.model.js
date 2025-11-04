import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PeliculasSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    maxlength: 50,
  },
}, {
  collection: 'peliculas',
});

PeliculasSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('peliculas', PeliculasSchema);

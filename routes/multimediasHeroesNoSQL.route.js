import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MultimediaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: 50,
  },
  url: {
    type: String,
    required: false,
    trim: true,
    maxlength: 250,
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    trim: true,
    maxlength: 15,
  },
}, {
  collection: 'multimedias',
});

MultimediaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Multimedias', MultimediaSchema);

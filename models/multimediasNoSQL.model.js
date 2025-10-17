import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MultimediasSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    maxlength: 50,
  },
  url: {
    type: String,
    maxlength: 250,
    default: null,
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    maxlength: 15,
  },
}, {
  collection: 'multimedias',
});

MultimediasSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Multimedias', MultimediasSchema);

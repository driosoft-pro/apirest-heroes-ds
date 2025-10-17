import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UsuariosSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    maxlength: 150,
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio'],
    maxlength: 250,
  },
  img: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
    maxlength: 150,
  },
  rol: {
    type: String,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
    default: 'USER_ROLE',
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  google: {
    type: Boolean,
    required: true,
    default: false,
  },
  fecha_creacion: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fecha_actualizacion: {
    type: Date,
    default: null,
  },
}, {
  collection: 'usuarios',
});

UsuariosSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Usuarios', UsuariosSchema);

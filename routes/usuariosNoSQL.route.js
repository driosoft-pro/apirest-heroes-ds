import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: 150,
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
    maxlength: 250,
    // Opcionalmente podrías usar select:false y exponerla manualmente cuando sea necesario
    select: false,
  },
  img: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
    trim: true,
    maxlength: 150,
  },
  rol: {
    type: String,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
    required: false,
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, 'El estado es obligatorio'],
  },
  google: {
    type: Boolean,
    required: [true, 'El indicador de Google es obligatorio'],
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    required: [true, 'La fecha de creación es obligatoria'],
  },
  fecha_actualizacion: {
    type: Date,
    required: false,
  },
}, {
  collection: 'usuarios',
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, ...data } = this.toObject();
  return data;
};

export default model('Usuarios', UsuarioSchema);

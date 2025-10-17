import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const ProtagonistasSchema = new Schema({
  papel: {
    type: String,
    default: null,
  },
  fecha_participacion: {
    type: Date,
    default: null,
  },
  heroes_id: {
    type: Types.ObjectId,
    ref: 'Heroes',
    required: [true, 'El id del héroe es obligatorio'],
  },
  peliculas_id: {
    type: Types.ObjectId,
    ref: 'Peliculas',
    required: [true, 'El id de la película es obligatorio'],
  },
}, {
  collection: 'protagonistas',
});

ProtagonistasSchema.index({ heroes_id: 1 });
ProtagonistasSchema.index({ peliculas_id: 1 });

ProtagonistasSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('Protagonistas', ProtagonistasSchema);

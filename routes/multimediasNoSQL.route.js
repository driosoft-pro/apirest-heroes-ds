import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

/**
 * Colección puente (many-to-many) entre Heroes y Multimedias,
 * equivalente a multimedias_heroe_ds en SQL.
 */
const MultimediaHeroeSchema = new Schema({
  heroes_id: {
    type: Types.ObjectId,
    ref: 'Heroes',
    required: [true, 'El heroe es obligatorio'],
    index: true,
  },
  idmultimedia: {
    type: Types.ObjectId,
    ref: 'Multimedias',
    required: [true, 'La multimedia es obligatoria'],
    index: true,
  },
}, {
  collection: 'multimedias_heroes',
});

/** Previene duplicados (un mismo par héroe-multimedia solo una vez). */
MultimediaHeroeSchema.index({ heroes_id: 1, idmultimedia: 1 }, { unique: true });

MultimediaHeroeSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('MultimediasHeroes', MultimediaHeroeSchema);

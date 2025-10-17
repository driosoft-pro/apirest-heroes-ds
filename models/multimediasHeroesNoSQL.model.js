import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const MultimediasHeroesSchema = new Schema({
  heroes_id: {
    type: Types.ObjectId,
    ref: 'Heroes',
    required: [true, 'El id del héroe es obligatorio'],
  },
  idmultimedia: {
    type: Types.ObjectId,
    ref: 'Multimedias',
    required: [true, 'El id de multimedia es obligatorio'],
  },
}, {
  collection: 'multimedias_heroe',
});

MultimediasHeroesSchema.index({ heroes_id: 1, idmultimedia: 1 }, { unique: true });

MultimediasHeroesSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

export default model('MultimediasHeroes', MultimediasHeroesSchema);

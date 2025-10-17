import mongoose from 'mongoose';
const { Schema, model, Collection } = mongoose;

export const HeroeSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'La biografía es obligatoria'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    aparicion: {
        type: Date,
        required: [true, 'Debe tener una fecha de aparición']
    },
    casa: {
        type: String,
        required: [true, 'La casa es obligatoria'],
    }
}, {
    collection: 'heroes'
});

HeroeSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

export default model('heroes', HeroeSchema);

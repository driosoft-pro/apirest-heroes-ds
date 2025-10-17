import { response } from 'express';
import Heroes from '../models/heroesNoSQL.model.js';

export const obtenerHeroes = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, heroes] = await Promise.all([
      Heroes.countDocuments(),
      Heroes.find({})
        .skip(Number(desde))
        .sort({ id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: heroes });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

export const obtenerHeroe = async (req, res = response) => {
  const { id } = req.params; // MongoID
  try {
    const heroe = await Heroes.findById(id);
    res.json({ Ok: true, resp: heroe });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

export const crearHeroe = async (req, res = response) => {
  const body = req.body;
  try {
    const heroeDB = await Heroes.findOne({ nombre: body.nombre });
    if (heroeDB) {
      return res.json({
        Ok: false,
        msg: `El héroe ${body.nombre} ya existe`,
      });
    }

    const heroe = new Heroes(body);
    await heroe.save();

    res.json({ Ok: true, msg: 'Héroe insertado', resp: heroe });
  } catch (error) {
    console.log('ERROR:INSERTAR', error);
    res.json({ Ok: false, msg: 'Error al insertar héroe', resp: error });
  }
};

export const actualizarHeroe = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const heroe = await Heroes.findByIdAndUpdate(id, data, { new: true });
    res.json({ Ok: true, msg: 'Héroe actualizado', resp: heroe });
  } catch (error) {
    console.log('ERROR_MODIFICAR', error);
    res.json({ Ok: false, resp: error });
  }
};

export const borrarHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const heroeBorrado = await Heroes.findByIdAndDelete(id);
    res.json({ Ok: true, msg: 'Héroe borrado', resp: heroeBorrado });
  } catch (error) {
    console.log('ERROR_BORRADO', error);
    res.json({ Ok: false, resp: error });
  }
};

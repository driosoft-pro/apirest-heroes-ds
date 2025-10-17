// controllers/heroesNoSQL.controller.js
import { response } from 'express';
import { Heroe } from '../models/index.js';

export const obtenerHeroes = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, heroes] = await Promise.all([
      Heroe.countDocuments(),
      Heroe.find({})
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
    const heroe = await Heroe.findById(id);
    res.json({ Ok: true, resp: heroe });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

export const crearHeroe = async (req, res = response) => {
  const body = req.body;
  try {
    const heroeDB = await Heroe.findOne({ nombre: body.nombre });
    if (heroeDB) {
      return res.json({
        Ok: false,
        msg: `El Heroe ${body.nombre}, ya existe`,
      });
    }

    const heroe = new Heroe(body);
    await heroe.save();

    res.json({ Ok: true, msg: 'Heroe Insertado', resp: heroe });
  } catch (error) {
    console.log('ERROR:INSERTAR', error);
    res.json({ Ok: false, msg: 'Error al Insertar Heroe', resp: error });
  }
};

export const actualizarHeroe = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const heroe = await Heroe.findByIdAndUpdate(id, data, { new: true });
    res.json({ Ok: true, msg: 'Heroe Actualizado', resp: heroe });
  } catch (error) {
    console.log('ERROR_MODIFICAR', error);
    res.json({ Ok: false, resp: error });
  }
};

export const borrarHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const heroeBorrado = await Heroe.findByIdAndDelete(id);
    res.json({ Ok: true, msg: 'Heroe Borrado', resp: heroeBorrado });
  } catch (error) {
    console.log('ERROR_BORRADO', error);
    res.json({ Ok: false, resp: error });
  }
};

import { response } from 'express';
import MultimediasHeroes from '../models/multimediasHeroesNoSQL.model.js';

// GET: listar relaciones con paginación
export const obtenerRelacionesMultimediasHeroes = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, registros] = await Promise.all([
      MultimediasHeroes.countDocuments(),
      MultimediasHeroes.find({})
        .populate('idmultimedia', 'nombre url tipo')
        .populate('heroes_id', 'nombre casa img')
        .skip(Number(desde))
        .sort({ _id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: registros });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// GET: una relación por id
export const obtenerRelacionMultimediaHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const registro = await MultimediasHeroes.findById(id)
      .populate('idmultimedia', 'nombre url tipo')
      .populate('heroes_id', 'nombre casa img');

    if (!registro) return res.json({ Ok: false, msg: `No existe relación con id: ${id}` });
    res.json({ Ok: true, resp: registro });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// POST: crear relación (evitar duplicados)
export const crearRelacionMultimediaHeroe = async (req, res = response) => {
  const { idmultimedia, heroes_id } = req.body;
  try {
    const existe = await MultimediasHeroes.findOne({ idmultimedia, heroes_id });
    if (existe) {
      return res.json({ Ok: false, msg: 'La relación multimedia-héroe ya existe' });
    }
    const registro = new MultimediasHeroes({ idmultimedia, heroes_id });
    await registro.save();
    res.status(201).json({ Ok: true, msg: 'Relación INSERTADA', resp: registro });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error al insertar relación', resp: error });
  }
};

// PUT: actualizar relación
export const actualizarRelacionMultimediaHeroe = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const registro = await MultimediasHeroes.findByIdAndUpdate(id, data, { new: true });
    if (!registro) return res.json({ Ok: false, msg: `No existe relación con id: ${id}` });
    res.json({ Ok: true, msg: 'Relación ACTUALIZADA', resp: registro });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// DELETE: eliminar relación
export const borrarRelacionMultimediaHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const registro = await MultimediasHeroes.findByIdAndDelete(id);
    if (!registro) return res.json({ Ok: false, msg: `No existe relación con id: ${id}` });
    res.json({ Ok: true, msg: 'Relación ELIMINADA', resp: registro });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

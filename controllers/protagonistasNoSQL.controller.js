import { response } from 'express';
import Protagonistas from '../models/protagonistasNoSQL.model.js';

// GET: listar protagonistas
export const protagonistasGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, protagonistas] = await Promise.all([
      Protagonistas.countDocuments(),
      Protagonistas.find({})
        .populate('heroes_id', 'nombre casa img')
        .populate('peliculas_id', 'nombre')
        .skip(Number(desde))
        .sort({ _id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: protagonistas });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// GET: protagonista por id
export const protagonistaIdGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    const protagonista = await Protagonistas.findById(id)
      .populate('heroes_id', 'nombre casa img')
      .populate('peliculas_id', 'nombre');
    if (!protagonista) return res.json({ Ok: false, msg: `No existe protagonista con id: ${id}` });
    res.json({ Ok: true, resp: protagonista });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// POST: crear protagonista
export const protagonistasPost = async (req, res = response) => {
  const body = req.body;
  try {
    const protagonista = new Protagonistas(body);
    await protagonista.save();
    res.status(201).json({ Ok: true, msg: 'Protagonista insertado', resp: protagonista });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error al insertar protagonista', resp: error });
  }
};

// PUT: actualizar protagonista
export const protagonistaPut = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const protagonista = await Protagonistas.findByIdAndUpdate(id, data, { new: true });
    if (!protagonista) return res.json({ Ok: false, msg: `No existe protagonista con id: ${id}` });
    res.json({ Ok: true, msg: 'Protagonista actualizado', resp: protagonista });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// DELETE: eliminar protagonista
export const protagonistaDelete = async (req, res = response) => {
  const { id } = req.params;
  try {
    const protagonista = await Protagonistas.findByIdAndDelete(id);
    if (!protagonista) return res.json({ Ok: false, msg: `No existe protagonista con id: ${id}` });
    res.json({ Ok: true, msg: 'Protagonista eliminado', resp: protagonista });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

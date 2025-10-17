import { response } from 'express';
import Multimedias from '../models/multimediasNoSQL.model.js';

// GET: listar multimedias con paginación
export const obtenerMultimedias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, multimedias] = await Promise.all([
      Multimedias.countDocuments(),
      Multimedias.find({})
        .skip(Number(desde))
        .sort({ _id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: multimedias });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// GET: una multimedia por MongoID
export const obtenerMultimedia = async (req, res = response) => {
  const { id } = req.params;
  try {
    const multimedia = await Multimedias.findById(id);
    if (!multimedia) return res.json({ Ok: false, msg: `No existe multimedia con id: ${id}` });
    res.json({ Ok: true, resp: multimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// POST: crear multimedia (evitar duplicados por nombre + url)
export const crearMultimedia = async (req, res = response) => {
  const body = req.body;
  try {
    const existe = await Multimedias.findOne({ nombre: body.nombre, url: body.url });
    if (existe) {
      return res.json({ Ok: false, msg: `La multimedia '${body.nombre}' ya existe con esa URL` });
    }
    const multimedia = new Multimedias(body);
    await multimedia.save();
    res.status(201).json({ Ok: true, msg: 'Multimedia insertada', resp: multimedia });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error al insertar multimedia', resp: error });
  }
};

// PUT: actualizar multimedia
export const actualizarMultimedia = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const multimedia = await Multimedias.findByIdAndUpdate(id, data, { new: true });
    if (!multimedia) return res.json({ Ok: false, msg: `No existe multimedia con id: ${id}` });
    res.json({ Ok: true, msg: 'Multimedia actualizada', resp: multimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// DELETE: eliminar multimedia
export const borrarMultimedia = async (req, res = response) => {
  const { id } = req.params;
  try {
    const multimediaBorrada = await Multimedias.findByIdAndDelete(id);
    if (!multimediaBorrada) return res.json({ Ok: false, msg: `No existe multimedia con id: ${id}` });
    res.json({ Ok: true, msg: 'Multimedia borrada', resp: multimediaBorrada });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

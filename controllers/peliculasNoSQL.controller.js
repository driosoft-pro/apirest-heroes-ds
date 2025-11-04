import { response } from 'express';
import Peliculas from '../models/peliculasNoSQL.model.js';
import Protagonistas from '../models/protagonistasNoSQL.model.js';
import Heroes from '../models/heroesNoSQL.model.js';
import Multimedias from '../models/multimediasNoSQL.model.js';

// GET: listar películas
export const peliculasGet = async (req, res = response) => {
  const { limite = 50, desde = 0 } = req.query;
  try {
    const [total, peliculas] = await Promise.all([
      Peliculas.countDocuments(),
      Peliculas.find({})
        .skip(Number(desde))
        .sort({ _id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: peliculas });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// GET: película por id
export const peliculaIdGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    const pelicula = await Peliculas.findById(id);
    if (!pelicula) return res.json({ Ok: false, msg: `No existe película con id: ${id}` });
    res.json({ Ok: true, resp: pelicula });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// POST: crear película (única por nombre)
export const peliculasPost = async (req, res = response) => {
  const body = req.body;
  try {
    const existe = await Peliculas.findOne({ nombre: body.nombre });
    if (existe) return res.json({ Ok: false, msg: `Ya existe una película con nombre: ${body.nombre}` });

    const pelicula = new Peliculas(body);
    await pelicula.save();
    res.json({ Ok: true, msg: 'Película INSERTADA', resp: pelicula });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error al insertar película', resp: error });
  }
};

// PUT: actualizar película
export const peliculaPut = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const pelicula = await Peliculas.findByIdAndUpdate(id, data, { new: true });
    if (!pelicula) return res.json({ Ok: false, msg: `No existe película con id: ${id}` });
    res.json({ Ok: true, msg: 'Película ACTUALIZADA', resp: pelicula });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// DELETE: eliminar película
export const peliculaDelete = async (req, res = response) => {
  const { id } = req.params;
  try {
    const pelicula = await Peliculas.findByIdAndDelete(id);
    if (!pelicula) return res.json({ Ok: false, msg: `No existe película con id: ${id}` });
    res.json({ Ok: true, msg: 'Película ELIMINADA', resp: pelicula });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// ===================== CONSULTAS EXTRAS =====================

// GET: protagonistas de una película (protagonistas -> héroe)
export const peliculaProtagonistasGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    const pelicula = await Peliculas.findById(id);
    if (!pelicula) return res.json({ Ok: false, msg: `No existe película con id: ${id}` });

    const protagonistas = await Protagonistas.find({ peliculas_id: id })
      .populate({ path: 'heroes_id', model: Heroes, select: 'nombre casa img' });

    if (!protagonistas.length) {
      return res.json({ Ok: false, msg: `No hay protagonistas para película con id: ${id}` });
    }

    res.json({ Ok: true, resp: protagonistas });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// GET: multimedias de los héroes protagonistas de una película
export const peliculaMultimediasGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    const pelicula = await Peliculas.findById(id);
    if (!pelicula) return res.json({ Ok: false, msg: `No existe película con id: ${id}` });

    // Protagonistas -> Héroe -> Multimedias (populate anidado)
    const protagonistas = await Protagonistas.find({ peliculas_id: id })
      .populate({
        path: 'heroes_id',
        model: Heroes,
        populate: {
          path: 'multimedias',              // asumiendo campo virtual/ref en Heroes
          model: Multimedias,
          select: 'nombre url tipo',
        },
        select: 'nombre casa img multimedias',
      });

    if (!protagonistas.length) {
      return res.json({ Ok: false, msg: `No hay multimedias para película con id: ${id}` });
    }

    res.json({ Ok: true, resp: protagonistas });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

import { response, request } from 'express';
import { Peliculas } from '../models/peliculasSQL.model.js';
import { Protagonistas } from '../models/protagonistasSQL.model.js';
import { Heroes } from '../models/heroesSQL.model.js';
import { Multimedias } from '../models/multimediasSQL.model.js';

// GET: listar todas las peliculas
export const peliculasGet = async (req, res = response) => {
    try {
        const peliculas = await Peliculas.findAll();
        res.json({ ok: true, data: peliculas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: una pelicula por id
export const peliculaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: `No existe película con id: ${id}` });
        }
        res.json({ ok: true, data: pelicula });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// POST: crear pelicula
export const peliculasPost = async (req, res = response) => {
    const { nombre } = req.body;
    try {
        const existePelicula = await Peliculas.findOne({ where: { nombre } });
        if (existePelicula) {
            return res.status(400).json({ ok: false, msg: `Ya existe una película con nombre: ${nombre}` });
        }
        const pelicula = await Peliculas.create({ nombre });
        res.json({ ok: true, msg: 'Película INSERTADA', data: pelicula });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// PUT: actualizar pelicula
export const peliculaPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: `No existe película con id: ${id}` });
        }
        await pelicula.update(body);
        res.json({ ok: true, msg: 'Película ACTUALIZADA', data: pelicula });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// DELETE: eliminar pelicula
export const peliculaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: `No existe película con id: ${id}` });
        }
        await pelicula.destroy();
        res.json({ ok: true, msg: 'Película ELIMINADA', data: pelicula });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// =============================================================================
// CONSULTAS EXTRAS ACTIVIDAD

export const peliculaProtagonistasGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    // 1. Verificar si la película existe
    const pelicula = await Peliculas.findByPk(id);
    if (!pelicula) {
        return res.status(404).json({ ok: false, msg: `No existe película con id: ${id}` });
    }

    // 2. Traer los protagonistas
    const protagonistas = await Protagonistas.findAll({
      where: { peliculas_id: id },
      include: [
        {
          model: Heroes,
          as: 'heroes',
          attributes: ['id', 'nombre', 'casa', 'img']
        }
      ]
    });

    if (!protagonistas.length) {
      return res.status(404).json({ ok: false, msg: `No hay protagonistas para película con id: ${id}` });
    }

    res.json({ ok: true, data: protagonistas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
  }
};

export const peliculaMultimediasGet = async (req, res = response) => {
  const { id } = req.params;
  try {
    // 1. Verificar si la película existe
    const pelicula = await Peliculas.findByPk(id);
    if (!pelicula) {
        return res.status(404).json({ ok: false, msg: `No existe película con id: ${id}` });
    }
    
    // 2. Traemos los protagonistas con su héroe y multimedia
    const protagonistas = await Protagonistas.findAll({
      where: { peliculas_id: id },
      include: [
        {
          model: Heroes,
          as: 'heroes',
          include: [
            {
              model: Multimedias,
              as: 'multimedias',
              through: { attributes: [] } // oculta la tabla intermedia
            }
          ]
        }
      ]
    });

    if (!protagonistas.length) {
      return res.status(404).json({ ok: false, msg: `No hay multimedias para película con id: ${id}` });
    }

    res.json({ ok: true, data: protagonistas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
  }
};

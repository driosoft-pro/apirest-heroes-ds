import { response, request } from 'express';
import { Peliculas } from '../models/peliculas.model.js';

export const peliculasGet = async (req, res = response) => {
    try {
        const peliculas = await Peliculas.findAll();
        res.json({ ok: true, data: peliculas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

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

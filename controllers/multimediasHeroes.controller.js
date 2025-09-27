import { response, request } from 'express';
import { MultimediasHeroes } from '../models/multimediasHeroes.model.js';

// GET: listar todos
export const multimediasHeroesGet = async (req, res = response) => {
    try {
        const registros = await MultimediasHeroes.findAll();
        res.json({ ok: true, data: registros });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: un registro por id
export const multimediasHeroesIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const registro = await MultimediasHeroes.findByPk(id);
        if (!registro) {
            return res.status(404).json({ ok: false, msg: `No existe multimediasHeroes con id: ${id}` });
        }
        res.json({ ok: true, data: registro });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// POST: crear registro
export const multimediasHeroesPost = async (req, res = response) => {
    const { multimedias_id, heroes_id } = req.body;
    try {
        const registro = await MultimediasHeroes.create({ multimedias_id, heroes_id });
        res.json({ ok: true, msg: 'Relación Multimedia-Héroe INSERTADA', data: registro });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// PUT: actualizar registro
export const multimediasHeroesPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const registro = await MultimediasHeroes.findByPk(id);
        if (!registro) {
            return res.status(404).json({ ok: false, msg: `No existe multimediasHeroes con id: ${id}` });
        }
        await registro.update(body);
        res.json({ ok: true, msg: 'Relación Multimedia-Héroe ACTUALIZADA', data: registro });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// DELETE: eliminar registro
export const multimediasHeroesDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const registro = await MultimediasHeroes.findByPk(id);
        if (!registro) {
            return res.status(404).json({ ok: false, msg: `No existe multimediasHeroes con id: ${id}` });
        }
        await registro.destroy();
        res.json({ ok: true, msg: 'Relación Multimedia-Héroe ELIMINADA', data: registro });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};



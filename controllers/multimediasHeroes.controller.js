import { response, request } from 'express';
import { MultimediasHeroes } from '../models/multimediasHeroes.model';

// GET: listar todos
const multimediasHeroesGet = async (req, res = response) => {
    try {
        const registros = await MultimediasHeroes.findAll();
        res.json({ ok: true, data: registros });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: un registro por id
const multimediasHeroesIdGet = async (req, res = response) => {
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
const multimediasHeroesPost = async (req, res = response) => {
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
const multimediasHeroesPut = async (req, res = response) => {
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
const multimediasHeroesDelete = async (req, res = response) => {
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

export default {
    multimediasHeroesGet,
    multimediasHeroesIdGet,
    multimediasHeroesPost,
    multimediasHeroesPut,
    multimediasHeroesDelete
};

import { response, request } from 'express';
import { Protagonistas } from '../models/protagonistas.model';

const protagonistasGet = async (req, res = response) => {
    try {
        const protagonistas = await Protagonistas.findAll();
        res.json({ ok: true, data: protagonistas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: `No existe protagonista con id: ${id}` });
        }
        res.json({ ok: true, data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistasPost = async (req, res = response) => {
    const { papel, fecha_participacion, heroes_id, peliculas_id } = req.body;
    try {
        // puedes validar si ya existe ese protagonista en la misma película
        const protagonista = await Protagonistas.create({ papel, fecha_participacion, heroes_id, peliculas_id });
        res.json({ ok: true, msg: 'Protagonista INSERTADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: `No existe protagonista con id: ${id}` });
        }
        await protagonista.update(body);
        res.json({ ok: true, msg: 'Protagonista ACTUALIZADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: `No existe protagonista con id: ${id}` });
        }
        await protagonista.destroy();
        res.json({ ok: true, msg: 'Protagonista ELIMINADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

export default {
    protagonistasGet,
    protagonistaIdGet,
    protagonistasPost,
    protagonistaPut,
    protagonistaDelete
};

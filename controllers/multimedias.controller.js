import { response, request } from 'express';
import { Multimedias } from '../models/multimedias.model';

// GET: listar todas las multimedias
const multimediasGet = async (req, res = response) => {
    try {
        const multimedias = await Multimedias.findAll();
        res.json({ ok: true, data: multimedias });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: una multimedia por id
const multimediaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const multimedia = await Multimedias.findByPk(id);
        if (!multimedia) {
            return res.status(404).json({ ok: false, msg: `No existe multimedia con id: ${id}` });
        }
        res.json({ ok: true, data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// POST: crear multimedia
const multimediasPost = async (req, res = response) => {
    const { tipo, url, peliculas_id } = req.body;
    try {
        const multimedia = await Multimedias.create({ tipo, url, peliculas_id });
        res.json({ ok: true, msg: 'Multimedia INSERTADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// PUT: actualizar multimedia
const multimediaPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const multimedia = await Multimedias.findByPk(id);
        if (!multimedia) {
            return res.status(404).json({ ok: false, msg: `No existe multimedia con id: ${id}` });
        }
        await multimedia.update(body);
        res.json({ ok: true, msg: 'Multimedia ACTUALIZADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// DELETE: eliminar multimedia
const multimediaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const multimedia = await Multimedias.findByPk(id);
        if (!multimedia) {
            return res.status(404).json({ ok: false, msg: `No existe multimedia con id: ${id}` });
        }
        await multimedia.destroy();
        res.json({ ok: true, msg: 'Multimedia ELIMINADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

export default {
    multimediasGet,
    multimediaIdGet,
    multimediasPost,
    multimediaPut,
    multimediaDelete
};

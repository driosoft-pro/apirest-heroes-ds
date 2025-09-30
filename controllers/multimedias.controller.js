import { response, request } from 'express';
import { Multimedias } from '../models/multimedias.model.js';

// GET: listar todas las multimedias
export const multimediasGet = async (req, res = response) => {
    try {
        const multimedias = await Multimedias.findAll();
        res.json({ ok: true, data: multimedias });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: una multimedia por id
export const multimediaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        // La validación de existencia por ID se hace en la ruta
        const multimedia = await Multimedias.findByPk(id); 
        res.json({ ok: true, data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// POST: crear multimedia
export const multimediasPost = async (req, res = response) => {
    const { nombre, url, tipo } = req.body;
    try {
        // Las validaciones de campos se hacen en la ruta
        const multimedia = await Multimedias.create({ nombre, url, tipo });
        res.status(201).json({ ok: true, msg: 'Multimedia INSERTADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// PUT: actualizar multimedia
export const multimediaPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    
    // Evitar la actualización de campos no deseados
    const { id: _, ...resto } = body;

    try {
        const multimedia = await Multimedias.findByPk(id);
        // La validación de existencia por ID se hace en la ruta
        
        await multimedia.update(resto);
        res.json({ ok: true, msg: 'Multimedia ACTUALIZADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// DELETE: eliminar multimedia
export const multimediaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        // La validación de existencia por ID se hace en la ruta
        const multimedia = await Multimedias.findByPk(id);
        
        await multimedia.destroy();
        res.json({ ok: true, msg: 'Multimedia ELIMINADA', data: multimedia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

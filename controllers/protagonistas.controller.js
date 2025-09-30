import { response, request } from 'express';
import { Protagonistas } from '../models/protagonistas.model.js';

// GET: listar todas las protagonistas
export const protagonistasGet = async (req, res = response) => {
    try {
        const protagonistas = await Protagonistas.findAll();
        res.json({ ok: true, data: protagonistas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// GET: una protagonista por id
export const protagonistaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        // La validación de existencia por ID se hace en la ruta
        const protagonista = await Protagonistas.findByPk(id);
        res.json({ ok: true, data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// POST: crear protagonista
export const protagonistasPost = async (req, res = response) => {
    const { papel, fecha_participacion, heroes_id, peliculas_id } = req.body;
    try {
        // Las validaciones de campos y FKs se hacen en la ruta
        const protagonista = await Protagonistas.create({ papel, fecha_participacion, heroes_id, peliculas_id });
        res.status(201).json({ ok: true, msg: 'Protagonista INSERTADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// PUT: actualizar protagonista
export const protagonistaPut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;
    
    // Evitar la actualización de campos no deseados
    const { id: _, ...resto } = body;
    
    try {
        const protagonista = await Protagonistas.findByPk(id);
        // La validación de existencia por ID se hace en la ruta
        
        await protagonista.update(resto);
        res.json({ ok: true, msg: 'Protagonista ACTUALIZADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

// DELETE: eliminar protagonista (borrado físico)
export const protagonistaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        // La validación de existencia por ID se hace en la ruta
        const protagonista = await Protagonistas.findByPk(id);
        
        await protagonista.destroy();
        res.json({ ok: true, msg: 'Protagonista ELIMINADO', data: protagonista });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

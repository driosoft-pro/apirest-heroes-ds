import { response, request } from 'express';
import { Heroes } from '../models/heroes.model.js';
import { bdmysql, bdmysqlNube } from '../database/connection.js';

export const heroesGet = async (req, res = response) => {

    try {
        const unosHeroes = await Heroes.findAll();
        res.json({
            ok: true,
            data: unosHeroes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};

export const heroeIdGet = async (req, res = response) => {

    const { id } = req.params;
    try {
        const unHeroe = await Heroes.findByPk(id);
        if (!unHeroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            })
        }

        res.json({
            ok: true,
            data: unHeroe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};

export const heroesComoGet = async (req = request, res = response) => {

    const { termino } = req.params;
    try {
        //const [results, metadata] = await bdmysqlNube.query(
        const [results, metadata] = await bdmysql.query(
            "SELECT nombre,bio" +
            " FROM heroes" +
            " WHERE nombre LIKE '%" + termino + "%'" +
            " ORDER BY nombre"
        );

        res.json({
            ok: true,
            data: results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

export const heroesPost = async (req, res = response) => {

    //Desestructuracion de datos del BODY en variables del programa
    const { nombre, bio, img, aparicion, casa, id } = req.body;
    const heroe = new Heroes({ nombre, bio, img, aparicion, casa });

    try {
        const existeHeroe = await Heroes.findOne({ where: { nombre: nombre } });
        if (existeHeroe) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un Heroe llamado: ' + nombre
            })
        }

        // Guardar en BD
        newHeroe = await heroe.save();

        //console.log(newHeroe.null);
        //Ajusta el Id del nuevo registro al Heroe
        heroe.id = newHeroe.null;
        res.json({
            ok: true,
            msg: 'Heroe INSERTADO',
            data: heroe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};

export const heroePut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    console.log(id);
    console.log(body);
    try {
        const heroe = await Heroes.findByPk(id);
        if (!heroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            })
        }
        console.log(body)

        await heroe.update(body);
        res.json({
            ok: true,
            msg: "Heroe ACTUALIZADO",
            data: heroe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};

export const heroeDelete = async (req, res = response) => {

    const { id } = req.params;
    console.log(id);

    try {
        const heroe = await Heroes.findByPk(id);
        if (!heroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            })
        }

        //Borrado de la BD
        await heroe.destroy();
        res.json({
            ok: true,
            msg: "Heroe ELIMINADO",
            data: heroe,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};



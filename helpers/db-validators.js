import { Usuarios } from "../models/usuarios.model.js";

// Validar si el rol existe
export const existeEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (existeEmail) {
        throw new Error(`El email ${correo} ya existe en la Base de Datos...`);
    }
};

// Validar si el usuario existe por id
export const noExisteEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (!existeEmail) {
        throw new Error(`El email ${correo} No existe en la Base de Datos...`);
    }
};


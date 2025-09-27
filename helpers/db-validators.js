import { Usuarios } from "../models/usuarios.model";

const existeEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (existeEmail) {
        throw new Error(`El email ${correo} ya existe en la Base de Datos...`);
    }
};

const noExisteEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (!existeEmail) {
        throw new Error(`El email ${correo} No existe en la Base de Datos...`);
    }
};

export default {
    existeEmail,
    noExisteEmail
};

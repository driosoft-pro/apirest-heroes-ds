import { Usuarios } from "../models/usuarios.model.js";

// Validar si el rol existe
export const existeEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (existeEmail) {
        throw new Error(`El email ${correo} ya existe en la Base de Datos...`);
    }
};

// Validar si el usuario existe por email (cuando se espera que no exista para POST)
export const noExisteEmail = async (correo = "") => {

    const existeEmail = await Usuarios.findOne({ where: { correo: correo } });

    if (!existeEmail) {
        throw new Error(`El email ${correo} No existe en la Base de Datos...`);
    }
};

// Validar si el usuario existe por ID (Nuevo)
export const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuarios.findByPk(id);

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

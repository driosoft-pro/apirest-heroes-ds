import { Usuarios } from "../models/usuariosSQL.model.js";
import { Heroes } from "../models/heroesSQL.model.js";
import { Peliculas } from "../models/peliculasSQL.model.js";
import { Multimedias } from "../models/multimediasSQL.model.js";
import { Protagonistas } from "../models/protagonistasSQL.model.js";

// === Validaciones de Usuario ===

// Valida si el email ya existe (Usado en POST para crear)
export const existeEmail = async (correo = "") => {
    const existe = await Usuarios.findOne({ where: { correo: correo } });
    if (existe) {
        throw new Error(`El email ${correo} ya existe en la Base de Datos.`);
    }
};

// Valida si el email NO existe (Usado en POST para Login)
export const noExisteEmail = async (correo = "") => {
    const existe = await Usuarios.findOne({ where: { correo: correo } });
    if (!existe) {
        throw new Error(`El email ${correo} No existe en la Base de Datos.`);
    }
};

// Valida si un usuario existe por ID (Usado en PUT/DELETE)
export const existeUsuarioPorId = async (id = '') => {
    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
        throw new Error(`El ID ${id} de usuario no existe en la Base de Datos.`);
    }
};


// === Validaciones de Heroes ===

// Valida si un heroe existe por ID (Usado como Foreign Key o en GET/PUT/DELETE)
export const existeHeroePorId = async (id = '') => {
    const heroe = await Heroes.findByPk(id);
    if (!heroe) {
        throw new Error(`El ID ${id} de héroe no existe en la Base de Datos.`);
    }
};

// === Validaciones de Peliculas ===

// Valida si una pelicula existe por ID
export const existePeliculaPorId = async (id = '') => {
    const pelicula = await Peliculas.findByPk(id);
    if (!pelicula) {
        throw new Error(`El ID ${id} de película no existe en la Base de Datos.`);
    }
};

// Valida si el nombre de una pelicula ya existe (Usado en POST para crear)
export const existePeliculaPorNombre = async (nombre = '') => {
    const pelicula = await Peliculas.findOne({ where: { nombre: nombre } });
    if (pelicula) {
        throw new Error(`El nombre de película "${nombre}" ya existe en la Base de Datos.`);
    }
};

// === Validaciones de Multimedias ===

// Valida si una multimedia existe por ID
export const existeMultimediaPorId = async (id = '') => {
    const multimedia = await Multimedias.findByPk(id);
    if (!multimedia) {
        throw new Error(`El ID ${id} de multimedia no existe en la Base de Datos.`);
    }
};

// Valida si el tipo de multimedia es válido
export const isTipoMultimediaValido = (tipo = '') => {
    const tiposValidos = ['IMAGEN', 'VIDEO', 'AUDIO', 'DOCUMENTO'];
    if (!tiposValidos.includes(tipo.toUpperCase())) {
        throw new Error(`El tipo de multimedia "${tipo}" no es válido. Tipos permitidos: ${tiposValidos.join(', ')}`);
    }
};

// === Validaciones de Protagonistas ===

// Valida si un protagonista existe por ID
export const existeProtagonistaPorId = async (id = '') => {
    const protagonista = await Protagonistas.findByPk(id);
    if (!protagonista) {
        throw new Error(`El ID ${id} de protagonista no existe en la Base de Datos.`);
    }
};

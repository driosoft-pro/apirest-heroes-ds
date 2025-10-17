import Usuarios from "../models/usuariosNoSQL.model.js";
import Heroes from "../models/heroesNoSQL.model.js";
import Peliculas from "../models/peliculasNoSQL.model.js";
import Multimedias from "../models/multimediasNoSQL.model.js";
import Protagonistas from "../models/protagonistasNoSQL.model.js";

// === Validaciones de Usuario ===

// Valida si el email ya existe (Usado en POST para crear)
export const existeEmail = async (correo = "") => {
  const existe = await Usuarios.findOne({ correo });
  if (existe) {
    throw new Error(`El email ${correo} ya existe en la Base de Datos.`);
  }
};

// Valida si el email NO existe (Usado en POST para Login)
export const noExisteEmail = async (correo = "") => {
  const existe = await Usuarios.findOne({ correo });
  if (!existe) {
    throw new Error(`El email ${correo} no existe en la Base de Datos.`);
  }
};

// Valida si un usuario existe por ID (Usado en PUT/DELETE)
export const existeUsuarioPorId = async (id = "") => {
  const usuario = await Usuarios.findById(id);
  if (!usuario) {
    throw new Error(`El ID ${id} de usuario no existe en la Base de Datos.`);
  }
};

// === Validaciones de Héroes ===

// Valida si un héroe existe por ID (Usado como FK o en GET/PUT/DELETE)
export const existeHeroePorId = async (id = "") => {
  const heroe = await Heroes.findById(id);
  if (!heroe) {
    throw new Error(`El ID ${id} de héroe no existe en la Base de Datos.`);
  }
};

// === Validaciones de Películas ===

// Valida si una película existe por ID
export const existePeliculaPorId = async (id = "") => {
  const pelicula = await Peliculas.findById(id);
  if (!pelicula) {
    throw new Error(`El ID ${id} de película no existe en la Base de Datos.`);
  }
};

// Valida si el nombre de una película ya existe (Usado en POST para crear)
export const existePeliculaPorNombre = async (nombre = "") => {
  if (!nombre) return;
  const pelicula = await Peliculas.findOne({ nombre });
  if (pelicula) {
    throw new Error(`El nombre de película "${nombre}" ya existe en la Base de Datos.`);
  }
};

// === Validaciones de Multimedias ===

// Valida si una multimedia existe por ID
export const existeMultimediaPorId = async (id = "") => {
  const multimedia = await Multimedias.findById(id);
  if (!multimedia) {
    throw new Error(`El ID ${id} de multimedia no existe en la Base de Datos.`);
  }
};

// Valida si el tipo de multimedia es válido
export const isTipoMultimediaValido = (tipo = "") => {
  const tiposValidos = ["IMAGEN", "VIDEO", "AUDIO", "DOCUMENTO"];
  if (!tipo || !tiposValidos.includes(String(tipo).toUpperCase())) {
    throw new Error(
      `El tipo de multimedia "${tipo}" no es válido. ` +
      `Tipos permitidos: ${tiposValidos.join(", ")}`
    );
  }
};

// === Validaciones de Protagonistas ===

// Valida si un protagonista existe por ID
export const existeProtagonistaPorId = async (id = "") => {
  const protagonista = await Protagonistas.findById(id);
  if (!protagonista) {
    throw new Error(`El ID ${id} de protagonista no existe en la Base de Datos.`);
  }
};


export const existeMultimediaHeroePorId = async (multimediaId = "", heroeId = "") => {
  const multimedia = await Multimedias.findById(multimediaId);
  if (!multimedia) {
    throw new Error(`El ID ${multimediaId} de multimedia no existe en la Base de Datos.`);
  }

  const heroe = await Heroes.findById(heroeId);
  if (!heroe) {
    throw new Error(`El ID ${heroeId} de héroe no existe en la Base de Datos.`);
  }
  if (String(multimedia.heroe_id) !== String(heroeId)) {
    throw new Error(`La multimedia con ID ${multimediaId} no pertenece al héroe con ID ${heroeId}.`);
  }
};

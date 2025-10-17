import Heroes from '../models/heroesNoSQL.model.js';

export const existeHeroePorId = async (id) => {
  // Verificar si el correo existe
  const existeHeroe = await Heroes.findById(id);
  if (!existeHeroe) {
    throw new Error(`El id no existe ${id}`);
  }
};


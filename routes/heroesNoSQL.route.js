// routes/heroesNoSQL.route.js
import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeHeroePorId } from '../helpers/db-validators.mongo.js';

import {
  obtenerHeroes,
  obtenerHeroe,
  crearHeroe,
  actualizarHeroe,
  borrarHeroe,
} from '../controllers/heroesNoSQL.controller.js';

const router = Router();

// END Points
router.get('/', obtenerHeroes);

router.get(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  obtenerHeroe
);

router.post('/', crearHeroe);

router.put(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  actualizarHeroe
);

router.delete(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  borrarHeroe
);

export default router;

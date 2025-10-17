import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeHeroePorId } from '../helpers/db-validatorsNoSQL.js';

import {
  heroesGet,
  heroeIdGet,
  heroesPost,
  heroePut,
  heroeDelete,
} from '../controllers/heroesNoSQL.controller.js';

const router = Router();

// END Points
router.get('/', heroesGet);

router.get(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  heroeIdGet
);

router.post('/', heroesPost);

router.put(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  heroePut
);

router.delete(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeHeroePorId),
  validarCampos,
  heroeDelete
);

export default router;

import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import {
  multimediasHeroesGet,
  multimediasHeroesIdGet,
  multimediasHeroesPost,
  multimediasHeroesPut,
  multimediasHeroesDelete,
} from '../controllers/multimediasHeroesNoSQL.controller.js';

import { existeMultimediaHeroePorId } from '../helpers/db-validatorsNoSQL.js';

const router = Router();

// GET públicos
router.get('/', multimediasHeroesGet);
router.get(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeMultimediaHeroePorId),
  validarCampos,
  multimediasHeroesIdGet
);

// Mutaciones protegidas
router.post('/', [validarJWT, esAdminRole], multimediasHeroesPost);

router.put(
  '/:id',
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeMultimediaHeroePorId),
  validarCampos,
  multimediasHeroesPut
);

router.delete(
  '/:id',
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeMultimediaHeroePorId),
  validarCampos,
  multimediasHeroesDelete
);

export default router;

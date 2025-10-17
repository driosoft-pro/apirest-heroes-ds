import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import {
  peliculasGet,
  peliculaIdGet,
  peliculasPost,
  peliculaPut,
  peliculaDelete,
} from '../controllers/peliculasNoSQL.controller.js';

import { existePeliculaPorId } from '../helpers/db-validatorsNoSQL.js';

const router = Router();

// GET públicos
router.get('/', peliculasGet);
router.get(
  '/:id',
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existePeliculaPorId),
  validarCampos,
  peliculaIdGet
);

// Mutaciones protegidas
router.post('/', [validarJWT, esAdminRole], peliculasPost);

router.put(
  '/:id',
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existePeliculaPorId),
  validarCampos,
  peliculaPut
);

router.delete(
  '/:id',
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existePeliculaPorId),
  validarCampos,
  peliculaDelete
);

export default router;

import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  protagonistasGet,
  protagonistaIdGet,
  protagonistasPost,
  protagonistaPut,
  protagonistaDelete,
} from "../controllers/protagonistasNoSQL.controller.js";

import { existeProtagonistaPorId } from "../helpers/db-validatorsNoSQL.js";

const router = Router();

// GET públicos
router.get("/", protagonistasGet);
router.get(
  "/:id",
  // check('id', 'No es un id de Mongo válido').isMongoId(),
  //check('id').custom(existeProtagonistaPorId),
  //validarCampos,
  protagonistaIdGet,
);

// Mutaciones protegidas
router.post("/", protagonistasPost);

router.put(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeProtagonistaPorId),
  validarCampos,
  protagonistaPut,
);

router.delete(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeProtagonistaPorId),
  validarCampos,
  protagonistaDelete,
);

export default router;

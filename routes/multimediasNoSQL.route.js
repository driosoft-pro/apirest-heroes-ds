import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  multimediasGet,
  multimediaIdGet,
  multimediasPost,
  multimediaPut,
  multimediaDelete,
} from "../controllers/multimediasNoSQL.controller.js";

import { existeMultimediaPorId } from "../helpers/db-validatorsNoSQL.js";

const router = Router();

// GET públicos
router.get("/", multimediasGet);
router.get(
  "/:id",
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeMultimediaPorId),
  validarCampos,
  multimediaIdGet,
);

// Mutaciones protegidas
router.post("/", multimediasPost);

router.put(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeMultimediaPorId),
  validarCampos,
  multimediaPut,
);

router.delete(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeMultimediaPorId),
  validarCampos,
  multimediaDelete,
);

export default router;

import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  usuariosPost,
  login,
  usuariosGet,
  usuariosPut,
  usuariosDelete,
} from "../controllers/usuariosNoSQL.controller.js";

import {
  existeUsuarioPorId,
  existeEmail,
  noExisteEmail,
} from "../helpers/db-validatorsNoSQL.js";

const router = Router();

// ===== Inserts / Auth =====
router.post(
  "/",
  check("nombre", "El nombre es obligatorio").not().isEmpty(),
  check("password", "El password debe de ser mas de 6 letras").isLength({
    min: 6,
  }),
  check("correo", "El correo es obligatorio").isEmail(),
  check("correo").custom(existeEmail),
  check("rol", "No es un rol valido").isIn("ADMIN_ROLE", "USER_ROLE"),
  validarCampos,
  usuariosPost,
);

router.post(
  "/login",
  check("correo", "El correo es obligatorio").isEmail(),
  check("correo").custom(noExisteEmail),
  check("password", "La contraseña es obligatoria").not().isEmpty(),
  check("password", "El password debe de ser mas de 6 letras").isLength({
    min: 6,
  }),
  validarCampos,
  login,
);

// ===== Gets =====
router.get("/", usuariosGet);

// ===== PUT / DELETE (protegidos) =====
router.put(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeUsuarioPorId),
  check("rol", "No es un rol valido")
    .optional()
    .isIn("ADMIN_ROLE", "USER_ROLE"),
  validarCampos,
  usuariosPut,
);

router.delete(
  "/:id",
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existeUsuarioPorId),
  validarCampos,
  usuariosDelete,
);

export default router;

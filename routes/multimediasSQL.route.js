import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  multimediasGet,
  multimediaIdGet,
  multimediasPost,
  multimediaPut,
  multimediaDelete,
} from "../controllers/multimediasSQL.controller.js";

const router = Router();

// END Points

// Rutas públicas
router.get("/", multimediasGet);
router.get("/:id", multimediaIdGet);

// Rutas de modificación y creación se protegen
router.post("/", [validarJWT, esAdminRole], multimediasPost);

router.put("/:id", [validarJWT, esAdminRole], multimediaPut);

router.delete("/:id", [validarJWT, esAdminRole], multimediaDelete);

export default router;

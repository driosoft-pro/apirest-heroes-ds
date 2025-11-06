import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  protagonistasGet,
  protagonistaIdGet,
  protagonistasPost,
  protagonistaPut,
  protagonistaDelete,
} from "../controllers/protagonistasSQL.controller.js";

const router = Router();

// END Points
router.get("/", protagonistasGet);
router.get("/:id", protagonistaIdGet);

// Rutas de modificación y creación se protegen
router.post("/", [validarJWT, esAdminRole], protagonistasPost);

router.put("/:id", [validarJWT, esAdminRole], protagonistaPut);

router.delete("/:id", [validarJWT, esAdminRole], protagonistaDelete);

export default router;

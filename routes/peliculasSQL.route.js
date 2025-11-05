import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  peliculasGet,
  peliculaIdGet,
  peliculasPost,
  peliculaPut,
  peliculaDelete,
} from "../controllers/peliculasSQL.controller.js";

const router = Router();

// END Points
router.get("/", peliculasGet);
router.get("/:id", peliculaIdGet);

// Rutas de modificación y creación se protegen
router.post("/", [validarJWT, esAdminRole], peliculasPost);

router.put("/:id", [validarJWT, esAdminRole], peliculaPut);

router.delete("/:id", [validarJWT, esAdminRole], peliculaDelete);

export default router;

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  heroesGet,
  heroeIdGet,
  heroesComoGet,
  heroesPost,
  heroePut,
  heroeDelete,
} from "../controllers/heroesSQL.controller.js";

const router = Router();

// END Points
router.get("/", heroesGet);
router.get("/:id", heroeIdGet);
router.get("/como/:termino", heroesComoGet);

router.post("/", [validarJWT, esAdminRole], heroesPost);

router.put("/:id", [validarJWT, esAdminRole], heroePut);

router.delete("/:id", [validarJWT, esAdminRole], heroeDelete);

export default router;

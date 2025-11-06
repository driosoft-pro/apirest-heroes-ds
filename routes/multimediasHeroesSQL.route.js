import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";

import {
  multimediasHeroesGet,
  multimediasHeroesIdGet,
  multimediasHeroesPost,
  multimediasHeroesPut,
  multimediasHeroesDelete,
} from "../controllers/multimediasHeroesSQL.controller.js";

const router = Router();

// END Points
router.get("/", multimediasHeroesGet);
router.get("/:id", multimediasHeroesIdGet);

router.post("/", [validarJWT, esAdminRole], multimediasHeroesPost);

router.put("/:id", [validarJWT, esAdminRole], multimediasHeroesPut);

router.delete("/:id", [validarJWT, esAdminRole], multimediasHeroesDelete);

export default router;

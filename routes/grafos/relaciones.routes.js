import { Router } from "express";
import {
  create,
  remove,
  listFrom,
} from "../../controllers/grafos/relaciones.controller.js";

const router = Router();

// Crea relación: body { fromLabel, fromId, type, toLabel, toId, props? }
router.post("/", create);

// Borra relación: body { fromLabel, fromId, type, toLabel, toId }
router.delete("/", remove);

// Lista relaciones salientes: /:label/:id
router.get("/:label/:id", listFrom);

export default router;

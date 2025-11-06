import { Router } from "express";
import {
  create,
  remove,
  listFrom,
  listTo,
  listAll,
  listFromByType,
  updateRelProps,
  deleteBetween,
  degree,
  neighbors,
  shortestPath,
  subgraph,
} from "../../controllers/grafos/relaciones.controller.js";

const router = Router();

// Crear / eliminar relación
router.post("/", create);
router.delete("/", remove);

// Entrantes, combinadas y por tipo
router.get("/in/:label/:id", listTo);
router.get("/all/:label/:id", listAll);
router.get("/:label/:id/by-type/:type", listFromByType);

// Actualizar o borrar múltiples
router.patch("/properties", updateRelProps);
router.delete("/between", deleteBetween);

// Analíticas
router.get("/degree/:label/:id", degree);
router.get("/neighbors/:label/:id", neighbors);
router.post("/shortest-path", shortestPath);
router.get("/subgraph/:label/:id", subgraph);

// Salientes (default)
router.get("/:label/:id", listFrom);

export default router;

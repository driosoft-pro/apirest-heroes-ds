import { Router } from "express";
import { check, param, body, query, validationResult } from "express-validator";
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

import {
  isValidLabel,
  isUUIDv4,
  isValidRelType,
  existeNodoPorId,
  existeRelacionExacta,
  noExisteRelacionExacta,
} from "../../helpers/db-validatorsGrafos.js";

const router = Router();

// Middleware local para devolver errores de validación
function validar(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({
        field: e.param,
        msg: e.msg,
      })),
    });
  }
  next();
}

// POST /api/grafos/relaciones
router.post(
  "/",
  [
    body("fromLabel").custom(isValidLabel),
    body("fromId").custom(isUUIDv4),
    body("type").custom(isValidRelType),
    body("toLabel").custom(isValidLabel),
    body("toId").custom(isUUIDv4),
    // existencia
    body().custom(async (v) => {
      await existeNodoPorId(v.fromLabel, v.fromId);
      await existeNodoPorId(v.toLabel, v.toId);
      // opcional: impedir duplicados a pesar de MERGE (estético)
      await noExisteRelacionExacta(
        v.fromLabel,
        v.fromId,
        v.type,
        v.toLabel,
        v.toId,
      );
      return true;
    }),
  ],
  validar,
  create,
);

// DELETE /api/grafos/relaciones
router.delete(
  "/",
  [
    body("fromLabel").custom(isValidLabel),
    body("fromId").custom(isUUIDv4),
    body("type").custom(isValidRelType),
    body("toLabel").custom(isValidLabel),
    body("toId").custom(isUUIDv4),
    body().custom(async (v) => {
      await existeRelacionExacta(
        v.fromLabel,
        v.fromId,
        v.type,
        v.toLabel,
        v.toId,
      );
      return true;
    }),
  ],
  validar,
  remove,
);

// GET /api/grafos/relaciones/in/:label/:id
router.get(
  "/in/:label/:id",
  [param("label").custom(isValidLabel), param("id").custom(isUUIDv4)],
  validar,
  listTo,
);

// GET /api/grafos/relaciones/all/:label/:id
router.get(
  "/all/:label/:id",
  [param("label").custom(isValidLabel), param("id").custom(isUUIDv4)],
  validar,
  listAll,
);

// GET /api/grafos/relaciones/:label/:id/by-type/:type
router.get(
  "/:label/:id/by-type/:type",
  [
    param("label").custom(isValidLabel),
    param("id").custom(isUUIDv4),
    param("type").custom(isValidRelType),
  ],
  validar,
  listFromByType,
);

// PATCH /api/grafos/relaciones/properties
router.patch(
  "/properties",
  [
    body("fromLabel").custom(isValidLabel),
    body("fromId").custom(isUUIDv4),
    body("type").custom(isValidRelType),
    body("toLabel").custom(isValidLabel),
    body("toId").custom(isUUIDv4),
    body("props").optional().isObject().withMessage("props debe ser un objeto"),
    body().custom(async (v) => {
      await existeRelacionExacta(
        v.fromLabel,
        v.fromId,
        v.type,
        v.toLabel,
        v.toId,
      );
      return true;
    }),
  ],
  validar,
  updateRelProps,
);

// DELETE /api/grafos/relaciones/between
router.delete(
  "/between",
  [
    body("fromLabel").custom(isValidLabel),
    body("fromId").custom(isUUIDv4),
    body("toLabel").custom(isValidLabel),
    body("toId").custom(isUUIDv4),
    body("type").optional().custom(isValidRelType),
    // verifica existencia de nodos (rel puede no existir y simplemente borrar 0)
    body().custom(async (v) => {
      await existeNodoPorId(v.fromLabel, v.fromId);
      await existeNodoPorId(v.toLabel, v.toId);
      return true;
    }),
  ],
  validar,
  deleteBetween,
);

// GET /api/grafos/relaciones/degree/:label/:id
router.get(
  "/degree/:label/:id",
  [param("label").custom(isValidLabel), param("id").custom(isUUIDv4)],
  validar,
  degree,
);

// GET /api/grafos/relaciones/neighbors/:label/:id?depth=&type=
router.get(
  "/neighbors/:label/:id",
  [
    param("label").custom(isValidLabel),
    param("id").custom(isUUIDv4),
    query("depth")
      .optional()
      .isInt({ min: 1, max: 3 })
      .withMessage("depth debe estar entre 1 y 3"),
    query("type").optional().custom(isValidRelType),
  ],
  validar,
  neighbors,
);

// POST /api/grafos/relaciones/shortest-path
router.post(
  "/shortest-path",
  [
    body("fromLabel").custom(isValidLabel),
    body("fromId").custom(isUUIDv4),
    body("toLabel").custom(isValidLabel),
    body("toId").custom(isUUIDv4),
    body("type").optional().custom(isValidRelType),
    body().custom(async (v) => {
      await existeNodoPorId(v.fromLabel, v.fromId);
      await existeNodoPorId(v.toLabel, v.toId);
      return true;
    }),
  ],
  validar,
  shortestPath,
);

// GET /api/grafos/relaciones/subgraph/:label/:id
router.get(
  "/subgraph/:label/:id",
  [param("label").custom(isValidLabel), param("id").custom(isUUIDv4)],
  validar,
  subgraph,
);

// --- Salientes por defecto: SIEMPRE al final ---
router.get(
  "/:label/:id",
  [param("label").custom(isValidLabel), param("id").custom(isUUIDv4)],
  validar,
  listFrom,
);

export default router;

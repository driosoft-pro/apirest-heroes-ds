import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import {
  comprasDeUsuario,
  detalleCompra,
  topPlatos,
  topSitios,
  serieDiaria,
} from "../../controllers/grafos/compras.controller.js";
import { isUUIDv4 } from "../../helpers/db-validatorsGrafos.js";

const router = Router();

function validar(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.param, msg: e.msg })),
    });
  }
  next();
}

const isoDate = (v) => {
  if (v == null || v === "") return true;
  // YYYY-MM-DD simple
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    throw new Error("La fecha debe tener formato YYYY-MM-DD");
  }
  return true;
};

// --- Agregados (poner ANTES de rutas con :id) ---
router.get(
  "/top/platos",
  [
    query("from").optional().custom(isoDate),
    query("to").optional().custom(isoDate),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit debe estar entre 1 y 100"),
  ],
  validar,
  topPlatos,
);

router.get(
  "/top/sitios",
  [
    query("from").optional().custom(isoDate),
    query("to").optional().custom(isoDate),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit debe estar entre 1 y 100"),
  ],
  validar,
  topSitios,
);

router.get(
  "/serie/diaria",
  [
    query("from").optional().custom(isoDate),
    query("to").optional().custom(isoDate),
  ],
  validar,
  serieDiaria,
);

// --- Compras por usuario ---
router.get(
  "/usuario/:id",
  [param("id").custom(isUUIDv4)],
  validar,
  comprasDeUsuario,
);

// --- Detalle de una compra (IMPORTANTE: dejar al final para no colisionar) ---
router.get("/:id", [param("id").custom(isUUIDv4)], validar, detalleCompra);

export default router;

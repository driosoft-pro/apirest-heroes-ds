import { Router } from "express";
import { param, query, body, validationResult } from "express-validator";
import {
  comprasDeUsuario,
  detalleCompra,
  topPlatos,
  topSitios,
  serieDiaria,
  create,
  list,
  getById,
  update,
  remove,
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

// --- Rutas de agregación (ANTES de rutas con :id) ---
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

router.get(
  "/usuario/:id",
  [param("id").custom(isUUIDv4)],
  validar,
  comprasDeUsuario,
);

// --- CRUD básico ---
router.post(
  "/",
  [
    body("usuarioId").notEmpty().custom(isUUIDv4),
    body("sitioId").notEmpty().custom(isUUIDv4),
    body("platoId").notEmpty().custom(isUUIDv4),
    body("fecha").notEmpty().custom(isoDate),
    body("total")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("total debe ser un número mayor o igual a 0"),
    body("cantidad")
      .optional()
      .isInt({ min: 1 })
      .withMessage("cantidad debe ser mayor a 0"),
    body("notas").optional().isString(),
  ],
  validar,
  create,
);

router.get("/", list);

router.get("/:id", [param("id").custom(isUUIDv4)], validar, getById);

router.put(
  "/:id",
  [
    param("id").custom(isUUIDv4),
    body("usuarioId").optional().custom(isUUIDv4),
    body("sitioId").optional().custom(isUUIDv4),
    body("platoId").optional().custom(isUUIDv4),
    body("fecha").optional().custom(isoDate),
    body("total").optional().isFloat({ min: 0 }),
    body("cantidad").optional().isInt({ min: 1 }),
    body("notas").optional().isString(),
  ],
  validar,
  update,
);

router.delete("/:id", [param("id").custom(isUUIDv4)], validar, remove);

export default router;

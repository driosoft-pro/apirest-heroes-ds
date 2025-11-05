import { Router } from "express";

import paisRoutes from "./grafos/pais.routes.js";
import ciudadRoutes from "./grafos/ciudad.routes.js";
import personaRoutes from "./grafos/persona.routes.js";
import sitioRoutes from "./grafos/sitio.routes.js";
import platoRoutes from "./grafos/plato.routes.js";
import usuarioRoutes from "./grafos/usuario.routes.js";
import relacionesRoutes from "./grafos/relaciones.routes.js";

const router = Router();

router.use("/pais", paisRoutes);
router.use("/ciudad", ciudadRoutes);
router.use("/persona", personaRoutes);
router.use("/sitio", sitioRoutes);
router.use("/plato", platoRoutes);
router.use("/usuario", usuarioRoutes);
router.use("/relaciones", relacionesRoutes);

export default router;

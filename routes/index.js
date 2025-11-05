import { Router } from "express";

// Importamos las rutas de SQL
import heroesSQLRoutes from "./heroesSQL.route.js";
import usuariosSQLRoutes from "./usuariosSQL.route.js";
import peliculasSQLRoutes from "./peliculasSQL.route.js";
import protagonistasSQLRoutes from "./protagonistasSQL.route.js";
import multimediasSQLRoutes from "./multimediasSQL.route.js";
import multimediasHeroesSQLRoutes from "./multimediasHeroesSQL.route.js";

// Importamos las rutas de NoSQL
import heroesNoSQLRoutes from "./heroesNoSQL.route.js";
import usuariosNoSQLRoutes from "./usuariosNoSQL.route.js";
import peliculasNoSQLRoutes from "./peliculasNoSQL.route.js";
import multimediasNoSQLRoutes from "./multimediasNoSQL.route.js";
import protagonistasNoSQLRoutes from "./protagonistasNoSQL.route.js";
import multimediasHeroesNoSQLRoutes from "./multimediasHeroesNoSQL.route.js";

// Importamos las rutas de grafos
import grafosRoutes from "./grafos.route.js";

const router = Router();

// Definimos los prefijos
router.use("/heroesSQL", heroesSQLRoutes);
router.use("/usuariosSQL", usuariosSQLRoutes);
router.use("/peliculasSQL", peliculasSQLRoutes);
router.use("/protagonistasSQL", protagonistasSQLRoutes);
router.use("/multimediasSQL", multimediasSQLRoutes);
router.use("/multimediasHeroesSQL", multimediasHeroesSQLRoutes);

// Importamos las rutas de NoSQL
router.use("/heroesNoSQL", heroesNoSQLRoutes);
router.use("/usuariosNoSQL", usuariosNoSQLRoutes);
router.use("/peliculasNoSQL", peliculasNoSQLRoutes);
router.use("/multimediasNoSQL", multimediasNoSQLRoutes);
router.use("/protagonistasNoSQL", protagonistasNoSQLRoutes);
router.use("/multimediasHeroesNoSQL", multimediasHeroesNoSQLRoutes);

// Importamos las rutas de grafos
router.use("/grafos", grafosRoutes);

export default router;

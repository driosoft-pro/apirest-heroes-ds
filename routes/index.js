import { Router } from 'express';

// Importamos todas las rutas
import heroesSQLRoutes from './heroesSQL.route.js';
import heroesNoSQLRoutes from './heroesNoSQL.route.js';
import usuariosSQLRoutes from './usuariosSQL.route.js';
//import usuariosNoSQLRoutes from './usuariosNoSQL.route.js';
import peliculasSQLRoutes from './peliculasSQL.route.js';
//import peliculasNoSQLRoutes from './peliculasNoSQL.route.js';
import protagonistasSQLRoutes from './protagonistasSQL.route.js';
//import protagonistasNoSQLRoutes from './protagonistasNoSQL.route.js';
import multimediasSQLRoutes from './multimediasSQL.route.js';
//import multimediasNoSQLRoutes from './multimediasNoSQL.route.js';
import multimediasHeroesSQLRoutes from './multimediasHeroesSQL.route.js';
//import multimediasHeroesNoSQLRoutes from './multimediasHeroesNoSQL.route.js';

const router = Router();

// Definimos los prefijos de cada recurso
router.use('/heroesSQL', heroesSQLRoutes);
router.use('/heroesNoSQL', heroesNoSQLRoutes);
router.use('/usuariosSQL', usuariosSQLRoutes);
router.use('/usuariosNoSQL', usuariosNoSQLRoutes);
router.use('/peliculasSQL', peliculasSQLRoutes);
router.use('/peliculasNoSQL', peliculasNoSQLRoutes);
router.use('/protagonistasSQL', protagonistasSQLRoutes);
router.use('/protagonistasNoSQL', protagonistasNoSQLRoutes);
router.use('/multimediasSQL', multimediasSQLRoutes);
router.use('/multimediasNoSQL', multimediasNoSQLRoutes);
router.use('/multimediasHeroesSQL', multimediasHeroesSQLRoutes);
router.use('/multimediasHeroesNoSQL', multimediasHeroesNoSQLRoutes);

export default router;

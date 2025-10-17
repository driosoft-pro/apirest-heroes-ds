import { Router } from 'express';

// Importamos todas las rutas
import heroesRoutes from './heroesSQL.route.js';
import usuariosRoutes from './usuariosSQL.route.js';
import peliculasRoutes from './peliculasSQL.route.js';
import protagonistasRoutes from './protagonistasSQL.route.js';
import multimediasRoutes from './multimediasSQL.route.js';
import multimediasHeroesRoutes from './multimediasHeroesSQL.route.js';

const router = Router();

// Definimos los prefijos de cada recurso
router.use('/heroes', heroesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/peliculas', peliculasRoutes);
router.use('/protagonistas', protagonistasRoutes);
router.use('/multimedias', multimediasRoutes);
router.use('/multimediasHeroes', multimediasHeroesRoutes);

export default router;

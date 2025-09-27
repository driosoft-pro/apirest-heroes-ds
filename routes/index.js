import { Router } from 'express';

// Importamos todas las rutas
import heroesRoutes from './heroes.route.js';
import usuariosRoutes from './usuarios.route.js';
import peliculasRoutes from './peliculas.route.js';
import protagonistasRoutes from './protagonistas.route.js';
import multimediasRoutes from './multimedias.route.js';
import multimediasHeroesRoutes from './multimediasHeroes.route.js';

const router = Router();

// Definimos los prefijos de cada recurso
router.use('/heroes', heroesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/peliculas', peliculasRoutes);
router.use('/protagonistas', protagonistasRoutes);
router.use('/multimedias', multimediasRoutes);
router.use('/multimediasHeroes', multimediasHeroesRoutes);

export default router;

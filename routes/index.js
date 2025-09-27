import { Router } from 'express';

// Importamos todas las rutas
import heroesRoutes from './heroes.route';
import usuariosRoutes from './usuarios.route';
import peliculasRoutes from './peliculas.route';
import protagonistasRoutes from './protagonistas.route';
import multimediasRoutes from './multimedias.route';
import multimediasHeroesRoutes from './multimediasHeroes.route';

const router = Router();

// Definimos los prefijos de cada recurso
router.use('/heroes', heroesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/peliculas', peliculasRoutes);
router.use('/protagonistas', protagonistasRoutes);
router.use('/multimedias', multimediasRoutes);
router.use('/multimediasHeroes', multimediasHeroesRoutes);

export default router;

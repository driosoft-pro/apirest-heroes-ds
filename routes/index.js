const { Router } = require('express');

// Importamos todas las rutas
const heroesRoutes = require('./heroes.route');      // ojo: tu archivo se llama heroes.route.js
const usuariosRoutes = require('./usuarios.route');  // igual, respeta los nombres
const peliculasRoutes = require('./peliculas.route');
const protagonistasRoutes = require('./protagonistas.route');
const multimediasRoutes = require('./multimedias.route');
const multimediasHeroesRoutes = require('./multimediasHeroes.route');

const router = Router();

// Definimos los prefijos de cada recurso
router.use('/heroes', heroesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/peliculas', peliculasRoutes);  
router.use('/protagonistas', protagonistasRoutes);
router.use('/multimedias', multimediasRoutes);
router.use('/multimediasHeroes', multimediasHeroesRoutes);

module.exports = router;

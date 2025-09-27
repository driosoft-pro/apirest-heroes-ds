import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { multimediasHeroesGet, multimediasHeroesIdGet, multimediasHeroesPost, multimediasHeroesPut, multimediasHeroesDelete } from '../controllers/multimediasHeroes.controller.js';

const router = Router();

// END Points

// Rutas de consulta (GET) se mantienen públicas
router.get('/', multimediasHeroesGet);
router.get('/:id', multimediasHeroesIdGet);

// Rutas de modificación y creación (POST, PUT, DELETE) se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], multimediasHeroesPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], multimediasHeroesPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediasHeroesDelete);

export default router;

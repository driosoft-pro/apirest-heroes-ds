import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { multimediasHeroesGet, multimediasHeroesIdGet, multimediasHeroesPost, multimediasHeroesPut, multimediasHeroesDelete } from '../controllers/multimediasHeroes.controller.js';

const router = Router();

// END Points

// Rutas de consulta mantienen públicas
router.get('/', multimediasHeroesGet);
router.get('/:id', multimediasHeroesIdGet);

// Rutas de modificación y creación se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediasHeroesPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediasHeroesPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediasHeroesDelete);

export default router;

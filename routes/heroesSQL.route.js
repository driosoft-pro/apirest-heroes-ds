import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js'; 
import { esAdminRole } from '../middlewares/validar-roles.js';

import { heroesGet, heroeIdGet, heroesComoGet, heroesPost, heroePut, heroeDelete } from '../controllers/heroesSQL.controller.js';

const router = Router();

// END Points

// Rutas de consulta mantienen públicas
router.get('/', heroesGet);
router.get('/:id', heroeIdGet);
router.get('/como/:termino', heroesComoGet);

router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], heroesPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], heroePut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], heroeDelete);

export default router;

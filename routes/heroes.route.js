import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js'; 
import { esAdminRole } from '../middlewares/validar-roles.js';

import { heroesGet, heroeIdGet, heroesComoGet, heroesPost, heroePut, heroeDelete } from '../controllers/heroes.controller.js';

const router = Router();

// END Points

// Rutas de consulta (GET) se mantienen públicas
router.get('/', heroesGet);
router.get('/:id', heroeIdGet);
router.get('/como/:termino', heroesComoGet);

// Rutas de modificación y creación (POST, PUT, DELETE) se protegen:
// 1. validarJWT: Asegura que haya un token válido y autentica al usuario.
// 2. esAdminRole: Asegura que el usuario autenticado tenga el rol 'ADMIN_ROLE'.

router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], heroesPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], heroePut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], heroeDelete);

export default router;

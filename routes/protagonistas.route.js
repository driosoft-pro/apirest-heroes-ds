import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { protagonistasGet, protagonistaIdGet, protagonistasPost, protagonistaPut, protagonistaDelete } from '../controllers/protagonistas.controller.js';

const router = Router();

// END Points

// Rutas de consulta (GET) se mantienen públicas
router.get('/', protagonistasGet);
router.get('/:id', protagonistaIdGet);

// Rutas de modificación y creación (POST, PUT, DELETE) se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], protagonistasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], protagonistaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], protagonistaDelete);

export default router;

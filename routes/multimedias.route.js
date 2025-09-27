import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js'; 
import { esAdminRole } from '../middlewares/validar-roles.js';

import { multimediasGet, multimediaIdGet, multimediasPost, multimediaPut, multimediaDelete } from '../controllers/multimedias.controller.js';

const router = Router();

// END Points

// Rutas de consulta (GET) se mantienen públicas
router.get('/', multimediasGet);
router.get('/:id', multimediaIdGet);

// Rutas de modificación y creación (POST, PUT, DELETE) se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], multimediasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], multimediaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediaDelete);

export default router;

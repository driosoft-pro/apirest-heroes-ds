import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js'; 
import { esAdminRole } from '../middlewares/validar-roles.js';

import { multimediasGet, multimediaIdGet, multimediasPost, multimediaPut, multimediaDelete } from '../controllers/multimedias.controller.js';

const router = Router();

// END Points

// Rutas de consulta mantienen públicas
router.get('/', multimediasGet);
router.get('/:id', multimediaIdGet);

// Rutas de modificación y creación se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], multimediaDelete);

export default router;

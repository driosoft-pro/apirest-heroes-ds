import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { protagonistasGet, protagonistaIdGet, protagonistasPost, protagonistaPut, protagonistaDelete } from '../controllers/protagonistasSQL.controller.js';

const router = Router();

// END Points

// Rutas de consulta mantienen públicas
router.get('/', protagonistasGet);
router.get('/:id', protagonistaIdGet);

// Rutas de modificación y creación se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], protagonistasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], protagonistaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], protagonistaDelete);

export default router;

import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { peliculasGet, peliculaIdGet, peliculasPost, peliculaPut, peliculaDelete } from '../controllers/peliculasSQL.controller.js';

const router = Router();

// END Points

// Rutas de consulta mantienen públicas
router.get('/', peliculasGet);
router.get('/:id', peliculaIdGet);

// Rutas de modificación y creación se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], peliculasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], peliculaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], peliculaDelete);

export default router;

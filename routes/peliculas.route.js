import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

import { peliculasGet, peliculaIdGet, peliculasPost, peliculaPut, peliculaDelete } from '../controllers/peliculas.controller.js';

const router = Router();

// END Points

// Rutas de consulta (GET) se mantienen públicas
router.get('/', peliculasGet);
router.get('/:id', peliculaIdGet);

// Rutas de modificación y creación (POST, PUT, DELETE) se protegen
router.post('/', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], peliculasPost);

router.put('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
    // Se pueden añadir más validaciones con check si son necesarias
], peliculaPut);

router.delete('/:id', [
    validarJWT, // Debe estar autenticado
    esAdminRole, // Debe ser administrador
], peliculaDelete);

export default router;

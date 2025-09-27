import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { usuariosPost, login, usuariosGet, usuariosPut, usuariosDelete } from '../controllers/usuarios.controller.js'; 
import { esAdminRole } from '../middlewares/validar-roles.js';
import { existeEmail, noExisteEmail, existeUsuarioPorId } from '../helpers/db-validators.js';

const router = Router();

// Inserts create
router.post('/',
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo es obligatorio').isEmail(), //Valido que el correo se un correo Valido
    check('correo').custom(existeEmail),
    check('rol', 'No es un rol valido').isIn('ADMIN_ROLE', 'USER_ROLE'),
    validarCampos,
    usuariosPost
);

// login users
router.post('/login',
    check('correo', 'El correo es obligatorio').isEmail(), //Valido que el correo se un correo Valido
    check('correo').custom(noExisteEmail),
    check('password', 'La contraseña es obligatoria').not().isEmpty(), //Valido que el password sea obligatorios
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    validarCampos,
    login
);

// Gets read
router.get('/', usuariosGet);

// PUT: actualizar usuario (Ruta Protegida: REQUIERE JWT Y ROL DE ADMINISTRADOR)
router.put('/:id', [
    validarJWT,
    esAdminRole, // <-- Protección de rol de administrador
    check('id', 'No es un ID válido').isNumeric(),
    check('id').custom(existeUsuarioPorId), // Asegurar que el usuario a actualizar existe
    check('rol', 'No es un rol valido').optional().isIn('ADMIN_ROLE', 'USER_ROLE'), // Rol opcional en el body si se quiere actualizar
    validarCampos,
], usuariosPut);

// DELETE: eliminar usuario (Ruta Protegida: REQUIERE JWT Y ROL DE ADMINISTRADOR)
router.delete('/:id', [
    validarJWT,
    esAdminRole, // <-- Protección de rol de administrador
    check('id', 'No es un ID válido').isNumeric(),
    check('id').custom(existeUsuarioPorId), // Asegurar que el usuario a eliminar existe
    validarCampos,
], usuariosDelete);

export default router;

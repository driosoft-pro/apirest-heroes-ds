import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { usuariosPost, login, usuariosGet } from '../controllers/usuarios.controller.js';
import { esAdminRole } from '../middlewares/validar-roles.js'; //Aqui importamos las validaciones del ROLE y de la existencia de un Usuario x el email.
import { existeEmail, noExisteEmail } from '../helpers/db-validators.js';

const router = Router();

// Inserts create
router.post('/',
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo es obligatorio').isEmail(), //Valido que el correo se un correo Valido
    //check('id').custom(existeUsuarioPorId),
    check('correo').custom(existeEmail),
    check('rol', 'No es un rol valido').isIn('ADMIN_ROLE', 'USER_ROLE'),
    validarCampos,
    usuariosPost
);

// login users
router.post('/login',
    check('correo', 'El correo es obligatorio').isEmail(), //Valido que el correo se un correo Valido
    //check('id').custom(existeUsuarioPorId),
    check('correo').custom(noExisteEmail),
    check('password', 'La contraseña es obligatoria').not().isEmpty(), //Valido que el password sea obligatorios
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    validarCampos,
    login
);

// routes
router.get('/',
    validarJWT, //Valido el TOKEN
    esAdminRole,
    validarCampos,
    usuariosGet
);

export default router;

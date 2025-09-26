const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    usuariosPost,
    login,
    usuariosGet
    //heroePut,
    //heroeDelete
} = require('../controllers/usuarios.controller');

//Aqui importamos las validaciones del ROLE y de la existencia de un Usuario x el email.
const { esAdminRole } = require('../middlewares/validar-roles');


const { existeEmail, noExisteEmail } = require('../helpers/db-validators');


const router = Router();

// Insert - CREATE
router.post('/',
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),

    //Valido que el correo se un correo Valido
    check('correo', 'El correo es obligatorio').isEmail(),
    //check('id').custom(existeUsuarioPorId),
    check('correo').custom(existeEmail),

    check('rol', 'No es un rol valido').isIn('ADMIN_ROLE', 'USER_ROLE'),

    validarCampos,

    usuariosPost);

router.post('/login',
    //Valido que el correo se un correo Valido
    check('correo', 'El correo es obligatorio').isEmail(),
    //check('id').custom(existeUsuarioPorId),
    check('correo').custom(noExisteEmail),

    //Valido que el password sea obligatorios
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),

    validarCampos,

    login);

router.get('/',
    //Valido el TOKEN
    validarJWT,

    esAdminRole,

    validarCampos,

    usuariosGet);


module.exports = router;

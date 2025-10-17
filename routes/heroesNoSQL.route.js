const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const { existeHeroePorId } = require('../helpers/db-validators.mongo');


const { obtenerHeroes,
        obtenerHeroe,

        crearHeroe,
        actualizarHeroe,
        borrarHeroe
} = require('../controllers/heroes.mongo.controller');


const router = Router();

//END Points
//SELECT/GET * from heroes
router.get('/', obtenerHeroes);

router.get('/:id', 
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,    
    obtenerHeroe);

router.post('/', crearHeroe);

router.put('/:id', 
    check('id', 'No es un id de Mongo válido').isMongoId(),   
    check('id').custom( existeHeroePorId ),
    validarCampos,    
    actualizarHeroe);

router.delete('/:id', 
    check('id', 'No es un id de Mongo válido').isMongoId(),   
    check('id').custom( existeHeroePorId ),
    validarCampos,    
    borrarHeroe);

module.exports = router;
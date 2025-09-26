const { Router } = require('express');

const { heroesGet,
        heroeIdGet,
        heroesComoGet,
        heroesPost,
        heroePut,
        heroeDelete
    //pruebaPost,
    //pruebaPut,
    //pruebaDelete,
    //pruebaPatch
} = require('../controllers/heroes.controller');

const router = Router();

//END Points
//SELECT/GET * from heroes
router.get('/', heroesGet);

router.get('/:id', heroeIdGet);

router.get('/como/:termino', heroesComoGet);

router.post('/', heroesPost);

router.put('/:id', heroePut);

router.delete('/:id', heroeDelete);

//router.patch('/', usuariosPatch);

module.exports = router;

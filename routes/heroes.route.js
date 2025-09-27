const { Router } = require('express');

const {
    heroesGet,
    heroeIdGet,
    heroesComoGet,
    heroesPost,
    heroePut,
    heroeDelete

} = require('../controllers/heroes.controller');

const router = Router();

//END Points
router.get('/', heroesGet);

router.get('/:id', heroeIdGet);

router.get('/como/:termino', heroesComoGet);

router.post('/', heroesPost);

router.put('/:id', heroePut);

router.delete('/:id', heroeDelete);

//router.patch('/', usuariosPatch);

module.exports = router;

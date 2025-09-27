const { Router } = require('express');

const {
  multimediasHeroesGet,
  multimediasHeroesIdGet,
  multimediasHeroesPost,
  multimediasHeroesPut,
  multimediasHeroesDelete
} = require('../controllers/multimediasHeroes.controller');

const router = Router();

// END Points
router.get('/', multimediasHeroesGet);

router.get('/:id', multimediasHeroesIdGet);

router.post('/', multimediasHeroesPost);

router.put('/:id', multimediasHeroesPut);

router.delete('/:id', multimediasHeroesDelete);

module.exports = router;

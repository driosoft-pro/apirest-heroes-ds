import { Router } from 'express';

import { multimediasHeroesGet, multimediasHeroesIdGet, multimediasHeroesPost, multimediasHeroesPut, multimediasHeroesDelete } from '../controllers/multimediasHeroes.controller';

const router = Router();

// END Points
router.get('/', multimediasHeroesGet);

router.get('/:id', multimediasHeroesIdGet);

router.post('/', multimediasHeroesPost);

router.put('/:id', multimediasHeroesPut);

router.delete('/:id', multimediasHeroesDelete);

export default router;

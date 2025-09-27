import { Router } from 'express';

import { heroesGet, heroeIdGet, heroesComoGet, heroesPost, heroePut, heroeDelete } from '../controllers/heroes.controller.js';

const router = Router();

//END Points
router.get('/', heroesGet);

router.get('/:id', heroeIdGet);

router.get('/como/:termino', heroesComoGet);

router.post('/', heroesPost);

router.put('/:id', heroePut);

router.delete('/:id', heroeDelete);

//router.patch('/', usuariosPatch);

export default router;
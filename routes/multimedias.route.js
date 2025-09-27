import { Router } from 'express';

import { multimediasGet, multimediaIdGet, multimediasPost, multimediaPut, multimediaDelete } from '../controllers/multimedias.controller.js';

const router = Router();

// END Points
router.get('/', multimediasGet);

router.get('/:id', multimediaIdGet);

router.post('/', multimediasPost);

router.put('/:id', multimediaPut);

router.delete('/:id', multimediaDelete);

export default router;

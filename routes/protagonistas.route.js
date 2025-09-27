import { Router } from 'express';

import { protagonistasGet, protagonistaIdGet, protagonistasPost, protagonistaPut, protagonistaDelete } from '../controllers/protagonistas.controller';

const router = Router();

// END Points
router.get('/', protagonistasGet);

router.get('/:id', protagonistaIdGet);

router.post('/', protagonistasPost);

router.put('/:id', protagonistaPut);

router.delete('/:id', protagonistaDelete);

export default router;

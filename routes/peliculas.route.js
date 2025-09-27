import { Router } from 'express';

import { peliculasGet, peliculaIdGet, peliculasPost, peliculaPut, peliculaDelete } from '../controllers/peliculas.controller';

const router = Router();

// END Points
router.get('/', peliculasGet);

router.get('/:id', peliculaIdGet);

router.post('/', peliculasPost);

router.put('/:id', peliculaPut);

router.delete('/:id', peliculaDelete);

export default router;

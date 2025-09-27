import { Router } from 'express';

import { peliculasGet, peliculaIdGet, peliculasPost, peliculaPut, peliculaDelete, peliculaProtagonistasGet, peliculaMultimediasGet} from '../controllers/peliculas.controller.js';

const router = Router();

// END Points
router.get('/', peliculasGet);

router.get('/:id', peliculaIdGet);

router.post('/', peliculasPost);

router.put('/:id', peliculaPut);

router.delete('/:id', peliculaDelete);

//ROUTES EXTRA ACTIVIDAD
router.get('/:id/protagonistas', peliculaProtagonistasGet);

router.get('/:id/multimedias', peliculaMultimediasGet);

export default router;

const { Router } = require('express');

const { 
    peliculasGet,
    peliculaIdGet,
    peliculasPost,
    peliculaPut,
    peliculaDelete
} = require('../controllers/peliculas.controller');

const router = Router();

// END Points
router.get('/', peliculasGet);

router.get('/:id', peliculaIdGet);

router.post('/', peliculasPost);

router.put('/:id', peliculaPut);

router.delete('/:id', peliculaDelete);

// router.patch('/', peliculasPatch); // si algún día lo requieres

module.exports = router;

const { Router } = require('express');

const {
  multimediasGet,
  multimediaIdGet,
  multimediasPost,
  multimediaPut,
  multimediaDelete
} = require('../controllers/multimedias.controller');

const router = Router();

// END Points
router.get('/', multimediasGet);

router.get('/:id', multimediaIdGet);

router.post('/', multimediasPost);

router.put('/:id', multimediaPut);

router.delete('/:id', multimediaDelete);

module.exports = router;

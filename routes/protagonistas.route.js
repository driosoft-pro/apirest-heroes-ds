const { Router } = require('express');

const {
  protagonistasGet,
  protagonistaIdGet,
  protagonistasPost,
  protagonistaPut,
  protagonistaDelete
} = require('../controllers/protagonistas.controller');

const router = Router();

// END Points
router.get('/', protagonistasGet);

router.get('/:id', protagonistaIdGet);

router.post('/', protagonistasPost);

router.put('/:id', protagonistaPut);

router.delete('/:id', protagonistaDelete);

module.exports = router;

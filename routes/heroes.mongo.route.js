const { Router } = require('express');

const { obtenerHeroes,
} = require('../controllers/heroes.mongo.controller');


const router = Router();

//END Points
//SELECT/GET * from heroes
router.get('/', obtenerHeroes);

module.exports = router;
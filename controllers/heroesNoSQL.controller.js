const { response } = require("express");
const  {Heroe} = require("../models");

//const  Heroe = require("../models/mongoHeroes.model");

//const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");

const obtenerHeroes = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  //const query = { estado: true };

  try {
    const [total, heroes] = await Promise.all([
      Heroe.countDocuments(),
      Heroe.find({})
        .skip(Number(desde))
        .sort({nombre:1})
        //.limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: heroes });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};


module.exports = {
  obtenerHeroes,
};

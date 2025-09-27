import { validationResult } from 'express-validator';

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log("llego aqui")
        return res.status(400).json(errors);
    }
    next();
}

export default {
    validarCampos
};

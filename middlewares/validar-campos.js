import { validationResult } from 'express-validator';

// Middleware para validar los campos de las requests
export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log("llego aqui")
        return res.status(400).json(errors);
    }
    next();
}

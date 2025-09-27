import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Generar JWT
export const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token')

            }
            else {
                resolve(token);
            }
        })
    })
}

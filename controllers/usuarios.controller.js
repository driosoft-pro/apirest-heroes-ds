import { Usuarios } from '../models/usuarios.model.js';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";

//INSERT - CREATE
export const usuariosPost = async (req, res = response) => {
    //Desestructuracion de los Datos, desde el BODY, que es donde estamos pasando la informacion
    const { nombre, correo, password, img, rol, google } = req.body;
    const usuario = new Usuarios({ nombre, correo, password, img, rol, google });

    try {
        const existeUsuario = await Usuarios.findOne({ where: { correo: correo } });
        if (existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un Usuario con el correo ' + correo
            })
        }
        console.log("Sin encriptar", usuario.password);

        //ENCRIPTAR la constraseña
        const salt = genSaltSync();

        //let unpassword = usuario.password;
        usuario.password = hashSync(usuario.password, salt);
        console.log("Encriptado", usuario.password);

        // Guardar en BD
        newUsuario = await usuario.save();
        //console.log(newHeroe.null);

        //Ajusta el Id del nuevo registro al Usuario
        usuario.id = newUsuario.null;
        res.json({
            ok: true,
            msg: "Usuario CREADO",
            data: usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};

export const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuarios.findOne({ where: { correo: correo } });
        console.log(usuario);
        if (!usuario) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - correo: " + correo,
                });
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - estado: false",
                });
        }

        const validaPassword = compareSync(password, usuario.password);

        // Verificar la contraseña
        if (!validaPassword) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - password",
                });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: "Login OK",
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador...",
            error: error,
        });
    }
};

export const usuariosGet = async (req, res = response) => {

    try {
        const unosUsuarios = await Usuarios.findAll();
        res.json({
            ok: true,
            data: unosUsuarios
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
};




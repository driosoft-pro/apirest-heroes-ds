import { Usuarios } from '../models/usuarios.model.js';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";
import { response } from 'express'; // Asegurar que 'response' esté importado

//INSERT - CREATE
export const usuariosPost = async (req, res = response) => {
    //Desestructuracion de los Datos, desde el BODY, que es donde estamos pasando la informacion
    const { nombre, correo, password, img, rol, google } = req.body;
    const usuario = Usuarios.build({ nombre, correo, password, img, rol, google }); // Usar build para crear una instancia

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
        const newUsuario = await usuario.save(); // Cambiado a const newUsuario
        //console.log(newHeroe.null);

        //Ajusta el Id del nuevo registro al Usuario
        usuario.id = newUsuario.null; // Esto puede ser incorrecto dependiendo de cómo Sequelize maneja los IDs, pero mantengo la lógica original.
        res.json({
            ok: true,
            msg: 'Usuario POST - Controlador',
            usuario: newUsuario // Retornar el usuario guardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
    }
};

// LOGIN
export const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuarios.findOne({ where: { correo: correo } });

        if (!usuario) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - correo",
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

// PUT: actualizar usuario
export const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { password, google, correo, ...resto } = req.body;

    try {
        const usuario = await Usuarios.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario con el id ${id}`
            });
        }

        if (password) {
            // Encriptar la nueva contraseña
            const salt = genSaltSync();
            resto.password = hashSync(password, salt);
        }

        // Se excluye correo y google ya que no se deberían actualizar desde aquí
        await usuario.update(resto);

        res.json({
            ok: true,
            msg: "Usuario ACTUALIZADO - Controlador",
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

// DELETE: eliminar usuario
export const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuarios.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario con el id ${id}`
            });
        }

        // Eliminación física (destroy) o cambio de estado a false (soft delete)
        // Para soft delete: await usuario.update({ estado: false });
        // Para eliminación física:
        await usuario.destroy();

        res.json({
            ok: true,
            msg: "Usuario ELIMINADO - Controlador",
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

import { response } from 'express';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';
import Usuarios from '../models/usuariosNoSQL.model.js';

// POST: crear usuario (registro)
export const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, img, rol, google } = req.body;

  try {
    const existeUsuario = await Usuarios.findOne({ correo });
    if (existeUsuario) {
      return res.json({ Ok: false, msg: `Ya existe un Usuario con el correo ${correo}` });
    }

    const salt = genSaltSync();
    const usuario = new Usuarios({
      nombre,
      correo,
      password: hashSync(password, salt),
      img,
      rol,
      google,
    });

    await usuario.save();

    res.json({ Ok: true, msg: 'Usuario creado', resp: usuario });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error al crear usuario', resp: error });
  }
};

// POST: login
export const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuarios.findOne({ correo });
    if (!usuario) {
      return res.json({ Ok: false, msg: 'Usuario / Password no son correctos - correo' });
    }

    if (usuario.estado === false) {
      return res.json({ Ok: false, msg: 'Usuario / Password no son correctos - estado: false' });
    }

    const validaPassword = compareSync(password, usuario.password);
    if (!validaPassword) {
      return res.json({ Ok: false, msg: 'Usuario / Password no son correctos - password' });
    }

    const token = await generarJWT(usuario.id);

    res.json({ Ok: true, msg: 'Login OK', usuario, token });
  } catch (error) {
    res.json({ Ok: false, msg: 'Error en login', resp: error });
  }
};

// GET: listar usuarios
export const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, usuarios] = await Promise.all([
      Usuarios.countDocuments(),
      Usuarios.find({})
        .skip(Number(desde))
        .sort({ _id: 1 })
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: usuarios });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// PUT: actualizar usuario (sin permitir actualizar correo/google directamente)
export const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;

  try {
    if (password) {
      const salt = genSaltSync();
      resto.password = hashSync(password, salt);
    }

    const usuario = await Usuarios.findByIdAndUpdate(id, resto, { new: true });
    if (!usuario) return res.json({ Ok: false, msg: `No existe usuario con id: ${id}` });

    res.json({ Ok: true, msg: 'Usuario actualizado', resp: usuario });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

// DELETE: eliminar usuario (físico o soft delete)
export const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const { modo = 'fisico' } = req.query; // ?modo=soft para soft delete
  try {
    let resultado;
    if (modo === 'soft') {
      resultado = await Usuarios.findByIdAndUpdate(id, { estado: false }, { new: true });
    } else {
      resultado = await Usuarios.findByIdAndDelete(id);
    }

    if (!resultado) return res.json({ Ok: false, msg: `No existe usuario con id: ${id}` });

    res.json({ Ok: true, msg: `Usuario ${modo === 'soft' ? 'desactivado' : 'eliminado'}`, resp: resultado });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

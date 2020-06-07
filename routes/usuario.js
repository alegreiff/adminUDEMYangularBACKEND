var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var mdAuthentication = require("../middlewares/authentication");

var app = express();

var Usuario = require("../models/usuario");

// 	=======================================
// 	Obtener todos los usuarios
// 	=======================================

app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde)
  Usuario.find({}, "nombre img email role google")
  .skip(desde)
  .limit(5)
  .exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error en BD",
        errors: err,
      });
    }
    Usuario.count({}, (err, conteo) => {
      res.status(200).json({
        ok: true,
        usuarios,
        total: conteo,
        saludos: 'Hola'
      });
    }) 
    
  });
});

// 	=======================================
// 	MODIFICAR un USUARIO
// 	=======================================
app.put("/:id", [mdAuthentication.verificaToken, mdAuthentication.verificaADMIN_O_MISMOUSUARIO], (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "Usuario con id " + id + " no existe",
        errors: { message: "No hay usuario con el ID suministrado" },
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al modificar usuario",
          errors: err,
        });
      }
      usuarioGuardado.password = ":)";
      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
      });
    });
  });
});

// 	=======================================
// 	Crear nuevo usuario
// 	=======================================

app.post("/", (req, res) => {
  var body = req.body;
  //console.log(body)
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario,
    });
  });
});

// 	=======================================
// 	BORRAR UN USUARIO POR ID
// 	=======================================

app.delete("/:id", [mdAuthentication.verificaToken, mdAuthentication.verificaADMIN_ROLE], (req, res) => {
  var id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar usuario",
        errors: err,
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe usuario con dicho ID",
        errors: { message: "No existe usuario con dicho ID" },
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado,
    });
  });
});

module.exports = app;

var express = require("express");
var fileupload = require("express-fileupload");
var fs = require("fs");

var app = express();

app.use(fileupload());

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  // TIPOS DE COLECCIÓN
  var tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Error COLECCIÓN NO VÁLIDO",
      errors: { message: "COLECCIÓN NO VÁLIDA" },
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "Error no hay archivo",
      errors: { message: "debe cargar una imagen" },
    });
  }

  //Obtener nombre de archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Extensiones aceptadas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  //Validar
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extensión NO VÁLIDA",
      errors: { message: `Ext. válidas: ${extensionesValidas.join(" / ")}` },
    });
  }

  //Nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  // Mover el archivo de temporal a PATH
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover el archivo",
        errors: err,
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
    /* res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreCortado,
            extensionArchivo
        }); */
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {

        if(!usuario){
            return res.status(400).json({
                ok: true,
                mensaje: "Usuario NO EXISTE",
                errors: { message: 'Usuario NO existe' }
              });
        }
      var pathViejo = "./uploads/usuarios/" + usuario.img;

      //SI existe, elimina imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {
          if (err) throw err;
        });
      }

      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
          usuarioActualizado.password = ':-('
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada",
          usuario: usuarioActualizado,
        });
      });
    });
  }
  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {

        if(!medico){
            return res.status(400).json({
                ok: true,
                mensaje: "Médico NO EXISTE",
                errors: { message: 'Médico NO existe' }
              });
        }
        var pathViejo = "./uploads/medicos/" + medico.img;
  
        //SI existe, elimina imagen anterior
        if (fs.existsSync(pathViejo)) {
          fs.unlink(pathViejo, (err) => {
            if (err) throw err;
          });
        }
  
        medico.img = nombreArchivo;
        medico.save((err, medicoActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de médico actualizada",
            medico: medicoActualizado,
          });
        });
      });      
  }
  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospital) => {

        if(!hospital){
            return res.status(400).json({
                ok: true,
                mensaje: "HospitaL NO EXISTE",
                errors: { message: 'HospitaL NO existe' }
              });
        }

        var pathViejo = "./uploads/hospitales/" + hospital.img;
  
        //SI existe, elimina imagen anterior
        if (fs.existsSync(pathViejo)) {
          fs.unlink(pathViejo, (err) => {
            if (err) throw err;
          });
        }
  
        hospital.img = nombreArchivo;
        hospital.save((err, hospitalActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de hospital actualizada",
            hospital: hospitalActualizado,
          });
        });
      });  
  }
}

module.exports = app;

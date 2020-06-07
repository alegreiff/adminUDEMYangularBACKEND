var express = require("express");
var mdAuthentication = require("../middlewares/authentication");

var app = express();

var Medico = require("../models/medico");
// 	=======================================
// 	Obtener todos los Médicos
// 	=======================================

app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde)
    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error en BD",
          errors: err,
        });
      }
      Medico.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          medicos,
          total: conteo
        });
      }) 
      
    });
  });

 
// 	=======================================
// 	FIN Obtener todos los Médicos
// 	=======================================

// 	=======================================
// 	OBTENER UN ÚNICO MÉDICO
// 	=======================================
app.get(':/id', (req, res) =>{
  var id = req.params.id;
  Medico.findById( id )
  .populate('usuario', 'nombre, email, img')
  .populate('hospital')
  .exec((err, medico)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar Médico",
        errors: err,
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "Médico id " + id + " no existe",
        errors: { message: "No hay Médico con el ID suministrado" },
      });
    }

    res.status(200).json({
      ok: true,
      medico
    });


  })

})
 
// 	=======================================
// 	FIN OBTENER UN ÚNICO MÉDICO
// 	=======================================


// 	=======================================
// 	Modificar un MÉDICO
// 	=======================================

app.put("/:id", mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
  
    Medico.findById(id, (err, medico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar Médico",
          errors: err,
        });
      }
  
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: "Médico id " + id + " no existe",
          errors: { message: "No hay Médico con el ID suministrado" },
        });
      }
  
      medico.nombre = body.nombre;
      medico.usuario = req.usuario._id
      medico.hospital = body.hospital;
  
      medico.save((err, medicoGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al modificar Médico",
            errors: err,
          });
        }
        
        res.status(200).json({
          ok: true,
          medico: medicoGuardado,
        });
      });
    });
  });
 
// 	=======================================
// 	FIN Modificar un MÉDICO
// 	=======================================

// 	=======================================
// 	Crear un MÉDICO
// 	=======================================

app.post("/", mdAuthentication.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
      nombre: body.nombre,
      usuario: req.usuario._id,
      hospital: body.hospital,

    });
  
    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear Médico",
          errors: err,
        });
      }
      res.status(201).json({
        ok: true,
        medico: medicoGuardado,
      });
    });
  });

// 	=======================================
// 	FIN Crear un MÉDICO
// 	=======================================

// 	=======================================
// 	BORRAR un Médico
// 	=======================================

app.delete("/:id", mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al borrar Hospital",
          errors: err,
        });
      }
  
      if (!medicoBorrado) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe médico con dicho ID",
          errors: { message: "No existe médico con dicho ID" },
        });
      }
  
      res.status(200).json({
        ok: true,
        medico: medicoBorrado,
      });
    });
  });
 
// 	=======================================
// 	FIN BORRAR un Médico
// 	=======================================


module.exports = app;
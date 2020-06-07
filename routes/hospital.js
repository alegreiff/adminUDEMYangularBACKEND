var express = require("express");
var mdAuthentication = require("../middlewares/authentication");

var app = express();

var Hospital = require("../models/hospital");
// 	=======================================
// 	Obtener todos los hospitales
// 	=======================================

app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error en BD",
          errors: err,
        });
      }

      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          hospitales,
          total: conteo,
        });
      });
    });
});

// 	=======================================
// 	FIN Obtener todos los hospitales
// 	=======================================

// 	=======================================
// 	Modificar un HOSPITAL
// 	=======================================

app.put("/:id", mdAuthentication.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar HOSPITAL",
        errors: err,
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "Hospital id " + id + " no existe",
        errors: { message: "No hay HOSPITAL con el ID suministrado" },
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al modificar Hospital",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado,
      });
    });
  });
});

// 	=======================================
// 	FIN Modificar un HOSPITAL
// 	=======================================

// 	=======================================
// 	Crear un HOSPITAL
// 	=======================================

app.post("/", mdAuthentication.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id,
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear Hospital mi perro",
        data: req.body,
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
    });
  });
});

// 	=======================================
// 	FIN Crear un HOSPITAL
// 	=======================================

// 	=======================================
// 	BORRAR un Hospital
// 	=======================================
app.delete("/:id", mdAuthentication.verificaToken, (req, res) => {
  var id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar Hospital",
        errors: err,
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe hospital con dicho ID",
        errors: { message: "No existe hospital con dicho ID" },
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado,
    });
  });
});

// 	=======================================
// 	FIN BORRAR un Hospital
// 	=======================================

// 	=======================================
// 	OBTENER HOSPITAL POR ID
// 	=======================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Hospital.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, hospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar hospital",
          errors: err,
        });
      }
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: "El hospital con el id " + id + "  no existe",
          errors: { message: "No existe un hospital  con ese ID" },
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospital,
      });
    });
});

// 	=======================================
// 	FIN OBTENER HOSPITAL POR ID
// 	=======================================

module.exports = app;

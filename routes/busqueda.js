var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario')


// 	=======================================
// 	BUSQUEDA COLECCION
// 	=======================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' )

    var tabla = req.params.tabla

    var promesa;
    switch(tabla) {
        case 'medicos':
            promesa = buscarMedicos( regex)
            
          break;
        case 'hospitales':
            promesa = buscarHospitales( regex)
            
          break;
        case 'usuarios':
            promesa = buscarUsuarios( regex)
            
            break;
        default:
          return res.status(400).json({
              ok: false,
              mensaje: 'Los tipos válidos son medicos, usuarios y hospitales',
              error: { message: 'NO VALIDA'}
          })
      }
      promesa.then( data => {
        
            res.status(200).json({
                ok: true,
                [tabla]: data
            })
        })
      

})
 
// 	=======================================
// 	FIN BUSQUEDA COLECCION
// 	=======================================


// 	=======================================
// 	BÚSQUEDA GENERAL
// 	=======================================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' )

    Promise.all([
        buscarHospitales( regex), 
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ])
    .then( respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })

});

// 	=======================================
// 	FIN BÚSQUEDA GENERAL
// 	=======================================

// 	=======================================
// 	FUNCIONES DE BÚSQUEDA
// 	=======================================

function buscarHospitales ( regex ){
    return new Promise ((resolve, reject) =>{
        Hospital.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .exec((err, hospitales)=>{
            if(err){
                reject('Error en Hospitales',err);
            }else{
                resolve(hospitales)
            }
        })
    })
}

function buscarMedicos ( regex ){
    return new Promise ((resolve, reject) =>{
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email role')
            .populate('hospital')
            .exec((err, medicos)=>{
            if(err){
                reject('Error en Médicos',err);
            }else{
                resolve(medicos)
            }
        })
    })
}

function buscarUsuarios ( regex ){
    return new Promise ((resolve, reject) =>{
        Usuario.find({}, 'nombre email role')
        .or([ {'nombre': regex}, { 'email': regex }  ])
        .exec((err, usuarios)=>{
            if(err){
                reject('Error en Usuarios',err);
            }else{
                resolve(usuarios)
            }
        })
    })
}
 
// 	=======================================
// 	FIN FUNCIONES DE BÚSQUEDA
// 	=======================================

module.exports = app;


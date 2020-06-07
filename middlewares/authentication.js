var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED


// 	=======================================
// 	VERIFICAR TOKEN
// 	=======================================

exports.verificaToken = function(req, res, next){
    var token = req.query.token;
    jwt.verify( token, SEED, (err, decoded ) =>{
      if(err) {
        return res.status(401).json({
          ok: false,
          mensaje: "Usuario NO autorizado TOKEN incorrecto",
          errors: err,
        });
      }
      req.usuario = decoded.usuario;
      next();
      

    })
}
   
  // 	=======================================
  // 	FIN VERIFICAR TOKEN
  // 	=======================================
  
  // 	=======================================
  // 	VERIFICAR ADMIN
  // 	=======================================
  exports.verificaADMIN_ROLE = function(req, res, next){

    var usuario = req.usuario;
    if( usuario.role === 'ADMIN_ROLE' ){
      next();
      return;
    }else{
      return res.status(401).json({
        ok: false,
        mensaje: "Usuario NO autorizado TOKEN incorrecto HACKER",
        errors: { message: 'NO es un administrador' },
      });
    }

}
   
  // 	=======================================
  // 	FIN VERIFICAR ADMIN
  // 	=======================================
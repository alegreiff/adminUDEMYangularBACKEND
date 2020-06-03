// Requires = importación de librerías
var express = require('express');
var mongoose = require ('mongoose')

// Inicializar Variables
var app = express();

// CONEXIÓN
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connection.openUri('mongodb+srv://userangular:angularuser@cluster0-vwlay.mongodb.net/test?retryWrites=true&w=majority/hospitalDB', (err, res) =>{
    if(err) throw err;
    console.log('Mongo DB \x1b[36m%s\x1b[0m', 'RUNNING')
})

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'petición correcta'
    })
})


//Escuchar

app.listen(3002, ()=>{
 console.log('Express server 3002 \x1b[36m%s\x1b[0m', 'ARRIADO')
})
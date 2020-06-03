// Requires = importación de librerías
var express = require('express');
var mongoose = require ('mongoose')

// Inicializar Variables
var app = express();
//app.use(express.json());
app.use(express.urlencoded())

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// CONEXIÓN
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

/* mongoose.connection.openUri('mongodb+srv://userangular:angularuser@cluster0-vwlay.mongodb.net/hospitalDB?retryWrites=true&w=majority/', (err, res) =>{
    if(err) throw err;
    console.log('Mongo DB \x1b[36m%s\x1b[0m', 'RUNNING')
}) */

mongoose.connection.openUri('mongodb+srv://userangular:angularuser@cluster0-vwlay.mongodb.net/hospitalDB?retryWrites=true/', (err, res) =>{
    if(err) throw err;
    console.log('Mongo DB \x1b[36m%s\x1b[0m', 'RUNNING')
})

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//Escuchar
app.listen(3002, ()=>{
 console.log('Express server 3002 \x1b[36m%s\x1b[0m', 'ARRIADO')
})
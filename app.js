//npm i body-parser --save
//npm i mongoose-unique-validator --save
//npm i bcrypt --save
//npm install jsonwebtoken --save
//npm install express-fileupload --save
//npm install serve-index --save

//==============================================
// BASE
//==============================================

// Requires - importacion de librerias que vamos a usar
var express = require('express');
var mongoose = require('mongoose');
var serveIndex=require('serve-index');
var bodyParser= require('body-parser');

// Inicializar variables
var app = express();

// Bpdy parser
// parse application/x-www-form-urlencoded
// convierte todos los bodys a objetos de js para poder usarlos
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//==============================================
// CONEXION A LA DB
//==============================================

mongoose.connection.openUri(
    'mongodb://localhost:27017/hospitalDB', (err, res) => {
        if (err) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    });

// SERVER INDEX CONFIG
// app.use(express.static(__dirname+'/'));
// app.use('/uploads',serveIndex(__dirname+'/uploads'));

//==============================================
// DEFINIR ARCHIVOS DE RUTAS
//==============================================

var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var imagenesRoutes = require('./routes/imagenes');
var hospitalRoutes = require('./routes/hospital');
var busquedaRoutes = require('./routes/busqueda');

// Rutas
// Middleware - cuando cualquier request haga match con esa ruta, usar el appRoutes
app.use('/login', loginRoutes);
app.use('/medico', medicoRoutes);
app.use('/upload', uploadRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/imagenes', imagenesRoutes);

app.use('/', appRoutes);


//==============================================
// LEVANTAR SERVER
//==============================================

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});


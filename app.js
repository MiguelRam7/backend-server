//npm i body-parser --save
//npm i mongoose-unique-validator --save
//npm i bcrypt --save
//npm install jsonwebtoken --save


// Requires - importacion de librerias que vamos a usar
var express = require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');

// Inicializar variables
var app = express();

// Bpdy parser
// parse application/x-www-form-urlencoded
// convierte todos los bodys a objetos de js para poder usarlos
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enlazar archivos de rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// COnexion a la BD
mongoose.connection.openUri(
    'mongodb://localhost:27017/hospitalDB', (err, res) => {
        if (err) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    });

// Rutas
// Middleware - cuando cualquier request haga match con esa ruta, usar el appRoutes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});


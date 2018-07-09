
// Requires
var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Variables
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;
var app = express();



app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuarios',
                errors: err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        // crear token!!!
        usuarioDB.password = ':D';
        //var token = jwt.sign({objeto a guardar en el token}, SEED-Semilla, { tiempo de expiracion del token });
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });// 14400/60/60=4hrs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        })
    });


})

module.exports = app;


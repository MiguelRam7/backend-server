
// Requires
var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Variables
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

var app = express();

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ==========================================
// VERIFICAR TOKEN DE GOOGLE
// ==========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


// ==========================================
// LOGIN GOOGLE
// ==========================================
app.post('/google', async (req, res) => {
    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                msg: 'token no valido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            })
        }


        // SI EL USUARIO EXISTE
        if (usuarioDB) {
            // SI no es AUTH GOOGLE
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal',
                    errors: err
                })
            } else {
                //var token = jwt.sign({objeto a guardar en el token}, SEED-Semilla, { tiempo de expiracion del token });
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });// 14400/60/60=4hrs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                })
            }

        } else {
            // SI EL USUARIO NO EXISTE...HAY QUE CREARLO
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':D';


            // Guardamos el usuario en la base
            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al buscar usuario',
                        errors: err
                    })
                }

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });// 14400/60/60=4hrs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                })
            })
        }
    })
});


// ==========================================
// LOGIN NORMAL
// ==========================================

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
                mensaje: 'Credenciales incorrectas',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            })
        }

        usuarioDB.password = ':D';

        // crear token!!!
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


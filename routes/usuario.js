// Requires =================================
var express = require('express');
var bcrypt = require('bcrypt');
var Usuario = require('../models/usuario');
var app = express();

//var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');


// ==========================================
// GET - Obtener todos los usuarios
// ==========================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                // SON ERROR
                if (err) {
                    res.status(500).json({
                        ok: false,
                        msg: 'Error cargando usuarios',
                        errors: err
                    });
                }

                // ON SUCCESS
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            })


});


// ==========================================
// PUT - Actualizar un usuario
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar usuario',
                errors: err
            });
        }
        // ON ERROR - USER NOT FOUND
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con el id: ' + id + '  no existe',
                errors: { message: 'no existe el usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuario.password = 'C:';
            // ON SUCCESS
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        })

    });
});


// ==========================================
// POST - Crear un usuario
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        // ON ERROR
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear usuario',
                errors: err
            });
        }

        // ON SUCCESS
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken:req.usuario
        });

    });
});


// ==========================================
// DELETE - Eliminar un usuario
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al borrar usuario',
                errors: err
            });
        }

        // ON ERROR
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        // ON SUCCESS
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
})

module.exports = app;
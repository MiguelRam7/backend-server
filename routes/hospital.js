// Requires =================================
var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==========================================
// GET - Obtener todos los hospitales
// ==========================================

app.get('/', (req, res, next) => {

    // ==========================================
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // ==========================================

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospitales) => {

                // ON ERROR
                if (err) {
                    res.status(500).json({
                        ok: false,
                        msg: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    // ON SUCCESS
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                })
            })
});


// ==========================================
// PUT - Actualizar un hospital
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar hospital',
                errors: err
            });
        }
        // ON ERROR - HOSPITAL NOT FOUND
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital con el id: ' + id + '  no existe',
                errors: { message: 'no existe el hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actualizar hospital',
                    errors: err
                });
            }


            // ON SUCCESS
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        })

    });
});


// ==========================================
// POST - Crear un hospital
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        // ON ERROR
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear hospital',
                errors: err
            });
        }

        // ON SUCCESS
        res.status(200).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });
});


// ==========================================
// DELETE - Eliminar un hospital
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al borrar hospital',
                errors: err
            });
        }

        // ON ERROR
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }
        // ON SUCCESS
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
})

module.exports = app;
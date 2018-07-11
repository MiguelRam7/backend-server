// Requires librerias =================================
var express = require('express');

var app = express();
var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==========================================
// GET - Obtener todos los medicos
// ==========================================

app.get('/', (req, res, next) => {

    // ==========================================
    // PAGINADO
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // ==========================================

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)    // desde
        .limit(5)       // limite de registros pos consulta
        .exec(
            (err, medicos) => {

                // ON ERROR
                if (err) {
                    res.status(500).json({
                        ok: false,
                        msg: 'Error cargando medicos',
                        errors: err
                    });
                }

                // ==========================================
                // Count de regisgtros en tabla medico
                Medico.count({}, (err, conteo) => {
                    // ON SUCCESS
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                })
                // ==========================================
            })
});


// ==========================================
// PUT - Actualizar un medico
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar medico',
                errors: err
            });
        }
        // ON ERROR - MEDICO NOT FOUND
        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: 'El medico con el id: ' + id + '  no existe',
                errors: { message: 'no existe el medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actualizar medico',
                    errors: err
                });
            }


            // ON SUCCESS
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        })

    });
});


// ==========================================
// POST - Crear un medico
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        // ON ERROR
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear medico',
                errors: err
            });
        }

        // ON SUCCESS
        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        });

    });
});


// ==========================================
// DELETE - Eliminar un medico
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al borrar medico',
                errors: err
            });
        }

        // ON ERROR
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }
        // ON SUCCESS
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    })
})



module.exports = app;
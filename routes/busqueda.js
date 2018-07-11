// Require librerias
var express = require('express');

var app = express();

var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

//==============================================
// DEFINIR RUTA DE BUSQUEDA EN LA COLECCION Y PARAMETRO SOLICITADOS
//==============================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var promesa;
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })
})


//==============================================
// DEFINIR RUTA DE BUSQUEDA EN TODAS LAS COLECCIONES
//==============================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])
        .then(respuestas => {
            res.status(200).json({
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});

//==============================================
// DEFINIR FUNCION DE BUSQUEDA EN HOSPITALES
//==============================================
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Hospital
            .find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) reject('Error al cargar hospitales', err)
                else resolve(hospitales)
            })
    })
}

//==============================================
// DEFINIR FUNCION DE BUSQUEDA EN MEDICOS
//==============================================
function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) reject('Error al cargar medicos', err)
                else resolve(medicos)
            })
    })
}

//==============================================
// DEFINIR FUNCION DE BUSQUEDA EN USUARIOS
//==============================================
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario
            .find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) reject('Error al cargar usuarios', err)
                else resolve(usuarios)
            })
    })
}


module.exports = app;
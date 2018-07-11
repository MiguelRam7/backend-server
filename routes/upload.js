
var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

// middleware
app.use(fileUpload());


// ==========================================
// SUBIR ARCHIVO EN RELACION A LA COLECCION
// ==========================================

app.put('/:tipo/:id', (req, res, next) => {
    // PARAMETROS REQUERIDOS
    // :id = idUsuario
    // :tipo = Coleccion existente ('hospitales', 'medicos', 'usuarios')

    // Obtener parametros de la url
    var id = req.params.id
    var tipo = req.params.tipo

    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    // COLECCION NOT FOUND
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Tipo de coleccion no valida' }
        });
    }

    // NO SUBIO ARCHIVO
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // VALIDAR EXTENSION DEL ARCHIVO
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son:' + extensionesValidas.join(', ') }
        });
    }

    // Crear nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        // ON ERROR
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    });
});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {

        case 'usuarios':

            Usuario.findById(id, (err, usuario) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no encontrado',
                        errors: err
                    });
                }
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no existe',
                        errors: { message: 'usuario no existe' }
                    });
                }

                var pathViejo = './uploads/usuarios/' + usuario.img;

                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) fs.unlink(pathViejo);

                usuario.img = nombreArchivo
                usuario.save((err, usuarioActualizado) => {

                    usuarioActualizado.password = ':D';

                    // ON SUCCESS
                    res.status(200).json({
                        ok: true,
                        msg: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });
                })
            });
            break;

        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no encontrado',
                        errors: err
                    });
                }

                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no existe',
                        errors: { message: 'Medico no existe' }
                    });
                }


                var pathViejo = './uploads/medicos/' + medico.img;

                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) fs.unlink(pathViejo);

                medico.img = nombreArchivo
                medico.save((err, medicoActualizado) => {

                    // ON SUCCESS
                    res.status(200).json({
                        ok: true,
                        msg: 'Imagen de medico actualizada',
                        medico: medicoActualizado
                    });
                })
            })
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Hospital no encontrado',
                        errors: err
                    });
                }

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'hospital no existe',
                        errors: { message: 'hospital no existe' }
                    });
                }

                var pathViejo = './uploads/hospitales/' + hospital.img;

                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) fs.unlink(pathViejo);

                hospital.img = nombreArchivo
                hospital.save((err, hospitalActualizado) => {

                    // ON SUCCESS
                    res.status(200).json({
                        ok: true,
                        msg: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                })
            })
            break;


    }
}

module.exports = app;
var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

// ==============================================
// Busqueda por coleccion
// ==============================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios',
                error: { message: 'Tipo de tabla no válido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            usuarios: data
        });
    });

});

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or({ 'nombre': regex }, { 'email': regex })
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });

    });
}

module.exports = app;
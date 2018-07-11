var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definir el hospitalModel
var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref:'Usuario' }
}, {collection:'hospitales'});


// Exportar el hospitalModel
module.exports = mongoose.model('Hospital', hospitalSchema);
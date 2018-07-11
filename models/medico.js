var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definir el medicoModel
var medicoSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref:'Usuario' },
    hospital:{
        type:Schema.Types.ObjectId,
        ref:'Hospital',
        required:[true, 'El id hospital es un campo obligatorio']
    }
});


// Exportar el medicoModel
module.exports = mongoose.model('Medico', medicoSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator= require('mongoose-unique-validator');
var rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol permitido'
}

// Definir el usuarioModel
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es obligatorio"] },
    email: { type: String, unique: true, required: [true, "El email es obligatorio"] },
    password: { type: String, required: [true, "El password es obligatorio"] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum:rolesValidos },
});

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});
// Exportar el usuarioModel
module.exports = mongoose.model('Usuario', usuarioSchema);
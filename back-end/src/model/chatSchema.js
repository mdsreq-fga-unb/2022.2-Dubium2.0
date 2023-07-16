const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    mensagens: {
        type: Array
    },
    notificacao: {
        type: Number
    },
    privado: {
        type: Boolean
    },
    usuarios: {
        type: Array
    },
    nome: {
        type: String
    },
    tema: {
        type: String
    },
    foto: {
        type: String
    },
    arquivada: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Chat", ChatSchema)
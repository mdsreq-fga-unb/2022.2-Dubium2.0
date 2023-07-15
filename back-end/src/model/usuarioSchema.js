const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
    nome_completo: {
      type: String,
      required: true
    },
    curso: {
      type: Number,
      required: true
    },
    matricula: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    celular: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    tokenRestaurarSenha: {
      type: String, 
    },
    expiracaoSenha: Date,
    salvos: {
      perguntas: {
        type: Array
      },
      respostas: {
        type: Array,
      },
      avisos: {
        type: Array
      }
    },
    chats: {
      type: Array,
    },
    foto: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3106/3106921.png"
    }
    
})

module.exports = mongoose.model("Usuario", UsuarioSchema)
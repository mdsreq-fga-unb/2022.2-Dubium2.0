const usuarioSchema = require("../model/usuarioSchema.js")
const respostaSchema = require("../model/respostaSchema.js")

const deletarRespostasPorUsuario = async (usuario) => {
    await respostaSchema.deleteMany({
    Usuario: {
          username: usuario.email,
          nome: usuario.nome_completo,
          id: usuario.id,
          curso: usuario.curso
        }
   })
}

const deletarRespostas = async (idUsuario) => {
    try {
        return await respostaSchema.deleteMany({ "Usuario.id": idUsuario }) 
    } catch (error) {
        throw new Error(error.message)
    }
}




module.exports = {
    deletarRespostasPorUsuario,
    deletarRespostas
}
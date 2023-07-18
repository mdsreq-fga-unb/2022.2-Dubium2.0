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

const editarResposta = async (idResposta, novoConteudo ) => {
    try {
        return await respostaSchema.findOneAndUpdate({ _id: idResposta }, { conteudo: novoConteudo })
    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = {
    deletarRespostasPorUsuario,
    editarResposta
}
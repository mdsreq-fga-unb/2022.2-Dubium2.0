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

const editarResposta = async (id, idUsuario, conteudo) => {
  return await respostaSchema.findOne({_id: id})
    .then(resposta => {
      if(resposta.Usuario.id != idUsuario){
        return res.status(403).send({error: "Você não pode editar essa resposta"})
      }
      return resposta.updateOne({conteudo: conteudo})
    })
    .catch(error => {throw new Error("Resposta não encontrada")})
}
module.exports = {
    deletarRespostasPorUsuario,
    editarResposta
}
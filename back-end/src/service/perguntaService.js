const avisoSchema = require("../model/avisoSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")
const usuarioService = require("../service/usuarioService.js")

const criarPergunta = async (titulo, curso, conteudo, filtro, idUsuario) => {
    const pergunta = new perguntaSchema({ titulo: titulo, curso: curso, conteudo: conteudo, filtro: filtro, idUsuario: idUsuario, data: Date.now() })
    return await pergunta.save()
}

const obterPerguntas = async () => {
    try {
        return await perguntaSchema.find().lean().sort({ data: -1 })
    } catch (error) {
        return new Error(error.message)
    }
}

const obterPerguntaPorId = async (id) => {
    try {
        return await perguntaSchema.findOne({ _id: id })
    } catch (error) {
        return new Error(error.message)
    }
}

const deletarPergunta = async (id, idUsuario) => {
    obterPerguntaPorId(id)
        .then(pergunta => {
            if(pergunta.idUsuario.id == idUsuario){
                return pergunta.deleteOne()
            } else {
                return res.status(401).send("Você não tem permissão para fazer esta operação")
            }
        })
        .catch(error => new Error("Falha ao procurar pergunta"))
}

const favoritarPergunta = async (id, idUser, favorito) => {
    return await perguntaSchema.findOne({ _id: id })
        .then(data => {
            if(favorito){
                return data.updateOne({ $inc: { favoritado: +1 }, $push: { "favoritadoPor": idUser } })
            } else {
                return data.updateOne({ $inc: { favoritado: -1 }, $pull: { "favoritadoPor": idUser } })
            }
        })
        .catch(error => {throw new Error("Pergunta não encontrada!")})
}

const salvarPergunta = async (id, idUser, salvo) => {
    try {
        usuarioService.buscarUsuario(idUser)
        .then(data => {
            if(salvo){
                return data.updateOne({ $push: { "salvos.perguntas": id }})
            } else {
                return data.updateOne({ $pull: { "salvos.perguntas": id } })
            }
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

const perguntasSalvas = async (arrayPerguntas) => {
    try {
        return await perguntaSchema.find({ _id: { $in: arrayPerguntas } }).lean()
    } catch (error) {
        throw new Error(error.message)
    }
}

const perguntasCadastradas = async (idUsuario) => {
    try {
        return await perguntaSchema.find({ "idUsuario.id": idUsuario }).lean()
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    criarPergunta,
    obterPerguntas,
    obterPerguntaPorId,
    deletarPergunta,
    favoritarPergunta,
    salvarPergunta,
    perguntasSalvas,
    perguntasCadastradas
}
const { json } = require("body-parser")
const avisoSchema = require("../model/avisoSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")
const perguntaService = require("../service/perguntaService.js")
const jwt = require('jsonwebtoken')


const criarPergunta = (req, res) => {
    const { titulo, curso, conteudo, filtro, idUser } = req.body
    const idUsuario = idUser
    perguntaService.criarPergunta(titulo, curso, conteudo, filtro, idUsuario)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Erro ao criar pergunta",
                message: err
            })
        })
}

const obterPerguntas = (req, res) => {
    perguntaService.obterPerguntas()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(404).send(err)
        })
}

const obterPerguntaPorId = (req, res) => {
    perguntaService.obterPerguntaPorId(req.params.id)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Erro ao procurar perguntar",
                message: err
            })
        })
}

const deletarPergunta = (req, res) => {
        const { id } = req.params
        perguntaService.deletarPergunta(id, req.user._id)
            .then(() => {
                res.status(201).send({
                message: "Pergunta deletada com sucesso!"
                });
            })
            .catch(err => {
                res.status(500).send({
                error: "Falha ao deletar pergunta",
                message: err
                });
            });   
}

const favoritarPergunta = (req, res) => {
    const { idUsuario, idPergunta, favorito } = req.body
    perguntaService.favoritarPergunta(idPergunta, idUsuario, favorito)
        .then(() => {
            res.status(201).send("Favoritos atualizado com sucesso!")
        })
        .catch(err => {
            res.send({
                error: "Erro ao atualizar favoritos",
                message: err
            })
        })
}

const salvarPergunta = (req, res) => {
    const { id_usuario, id_pergunta, salvo } = req.body
    perguntaService.salvarPergunta(id_pergunta, id_usuario, salvo)
        .then(() => {
            res.status(201).send("Pergunta alterada com sucesso!")
        })
        .catch(err => {
            res.status(400).send({
                error: "Erro ao alterar pergunta!",
                message: err
            })
        })
}

const perguntasSalvas = (req, res) => {
    const { arrayPerguntas } = req.body
    perguntaService.perguntasSalvas(arrayPerguntas)
        .then((data) => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Nao foi possível achar",
                message: err
            })
        })
}

const perguntasCadastradas = (req, res) => {
    const { idUsuario } = req.body
    perguntaService.perguntasCadastradas(idUsuario)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Erro ao achar as perguntas",
                message: err
            })
        })
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
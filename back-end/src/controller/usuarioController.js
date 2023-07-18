const { json } = require("body-parser")
const passport = require("passport")
const usuarioSchema = require("../model/usuarioSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const chatSchema = require("../model/chatSchema.js")
const usuarioService = require("../service/usuarioService.js")
const jwt = require('jsonwebtoken')
const avisoService = require("../service/avisoService.js")
const perguntaService = require("../service/perguntaService.js")
const respostaService = require("../service/respostaService.js")

const buscarUsuario = (req, res) => {
    const { id } = req.params
    usuarioService.buscarUsuario(id)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Usuario não encontrado",
                message: err
            })
        })
}

const editarUsuario = (req, res) => {
    const { id } = req.params
    const { nome_completo, matricula, curso, celular, email, password } = req.body
    usuarioService.editarUsuario(id, req.user._id, nome_completo, matricula, curso, celular, email, password)
        .then(() => {
            res.status(201).send("Alterado com sucesso!")
        })
        .catch(err => {
            res.status(401).send({
                error: "Erro ao salvar as alterações!",
                message: err
            })
        })
}

const conteudosSalvos = (req, res) => {
    const { id } = req.params
    usuarioService.conteudosSalvos(id)
        .then(data => {
            res.status(201).json(data.salvos)
        })
        .catch(err => {
            res.status(404).send({
                error: "Falha ao encontrar usuário",
                message: err
            })
        })
}

const obterUsuarios = (req, res) => {
    usuarioService.obterUsuarios()
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Erro ao encontrar usuários",
                message: err
            })
        })
}

const salvarFoto = (req, res) => {
    const { idUsuario, url } = req.body
    usuarioService.salvarFoto(idUsuario, url)
        .then(response => {
            res.status(200).send(response)
        })
        .catch(err => {
            res.status(400).send({
                error: "Erro ao salvar foto",
                message: err
            })
        })
}

const instanciarChatUsuario = (req, res) => {
    const { user, userTarget, privado } = req.body
    const userIds = [user.id, userTarget.id]
    const users = {user, userTarget} 
    const infosChat = {
        usuarios: userIds,
        privado: privado,
        idChat: ''
    }
    usuarioService.instanciarChatUsuario(privado, users, infosChat, userIds)
        .then((data) => {
            res.status(200).json(data.data)
        })
        .catch(err => {
            res.status(400).send({ erro: "Falha ao salvar instância", message: err.message })
        })
}

const obterFotos = (req, res) => {
    usuarioService.obterUsuarios()
        .then((data) => {
            const objectData = {}
            data.map(e => {
                objectData[`${e._id}`] = e.foto
            })
            res.status(200).send(objectData)
        })
        .catch(err => {
            res.status(400).send({ erro: "Falha ao encontrar usuarios", message: err.message })
        })
}

const deletarUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.body
        await avisoService.deletarAvisos(idUsuario)
        await perguntaService.deletarPerguntas(idUsuario)
        await respostaService.deletarRespostas(idUsuario)
        await usuarioService.limparChatsEmUsuarios(idUsuario)
        await usuarioService.deletarChats(idUsuario)
        await deletarUsuario(idUsuario)
        res.status(200).send("deletado com sucesso!")
    } catch (err) {
        res.status(404).send({ error: "Erro ao deletar usuario", message: err.message });
    }
}



module.exports = {
    buscarUsuario,
    editarUsuario,
    conteudosSalvos,
    obterUsuarios,
    salvarFoto,
    instanciarChatUsuario,
    obterFotos,
    deletarUsuario
}
const express = require("express")
const router = express.Router()
router.use(express.json())
const jwt = require("jsonwebtoken")
const chatSchema = require('../model/chatSchema.js')
const passport = require("passport")
const usuarioSchema = require("../model/usuarioSchema.js")
const redisClient = require("../config/RedisConfig.js")
const chatService = require("../service/chatService.js")
const redisService = require("../service/redisService.js")
const usuarioService = require("../service/usuarioService.js")


const obterChatsPorUsuario = (req, res) => {
    const { chats } = req.body
    const idChats = chats.map(chat => chat.idChat)
    chatService.obterChatsPorUsuario(idChats)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(400).send({ error: "Erro ao fazer requisição", message: err })
        })
}

const obterChat = async (req, res) => {
    const { idChat } = req.params
    const chatCache = await redisClient.get(idChat)
    if(chatCache){
        res.status(200).send(chatCache)
    } else {
        chatService.obterChat(idChat)
        .then(async (data) => {
            redisService.salvarMensagensCache(idChat, data)
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(400).send({ error: "Erro ao fazer requisição", message: error })
        })
    }
}

const salvarMensagens = (req, res) => {
    const { messages, idChat } = req.body
    chatService.salvarMensagens(idChat, messages)
        .then(async (updatedChat) => {
            updatedChat.mensagens.push(messages[0])
            redisService.salvarMensagensCache(idChat, updatedChat)
            res.status(200).send("Mensagens salvas com sucesso")
        })
        .catch(error => {
            res.status(400).send({ error: "Erro ao fazer requisição", message: error })
        });
}

 const instanciarChatPublico = (req, res) => {
    const { privado, nome, tema, userAdmin, foto } = req.body
    usuarioService.instanciarChatPublico(privado, nome, tema, userAdmin, foto, userAdmin.id)
    .then(response => {
        res.status(200).send("Instância pública criada com sucesso!")
    })
    .catch(err => res.status(400).send({error: "Erro ao salvar instância no usuario", message: err}
    ))
}

const listarChatsPublicos = (req, res) => {
    chatService.listarChatsPublicos()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => res.status(400).send({error: "Erro ao encontrar chats", message: err}))
}


const adicionarUsuarioEmGrupo = (req, res) => {
    const { idChat, idUsuario } = req.body
    chatService.adicionarUsuarioEmGrupo(idChat, idUsuario)
        .then(response => {
            res.status(200).send("Usuario adicionado ao chat com sucesso!")
        })
        .catch(err => res.status(400).send({error: "Erro ao registrar usuario no chat", message: err}))
}



// router.post("/user", passport.authenticate('jwt', { session: false }), (req, res) => {
//     const { idUser } = req.body
//     chatSchema.find({
//         $or: [
//           { "usuarios.0.user.id": idUser },
//           { "usuarios.0.userTarget.id": idUser }
//         ]
//       }).select({ usuarios: 1, _id: 0 })
//         .then(data => {
//             res.status(200).send(data)
//         })
//         .catch(err => res.status(400).send({error: "Erro ao encontrar chats", message: err}))
// })




module.exports = {
    obterChatsPorUsuario,
    obterChat,
    salvarMensagens,
    instanciarChatPublico,
    listarChatsPublicos,
    adicionarUsuarioEmGrupo
}
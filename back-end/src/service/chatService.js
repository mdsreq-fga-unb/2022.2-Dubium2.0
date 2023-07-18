const chatSchema = require("../model/chatSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")


const criarInstanciaChat = async (privado, users) => {
    try {
        return await new chatSchema({ privado: privado, usuarios: users }).save()
    } catch (error) {
        throw new Error(error.message)
    }
}

const criarChatPublico = async (privado, nome, tema, userAdmin, foto) => {
    try {
        return await new chatSchema({ privado: privado, nome: nome, tema: tema, usuarios: [userAdmin], foto: foto }).save()
    } catch (error) {
        throw new Error(error.message)
    }
}

const listarChatsPublicos = async () => {
    try {
        return await chatSchema.find({ privado: false }).lean()
    } catch (error) {
        throw new Error(error.message)
    }
}



const obterChatsPorUsuario = async (idChats) => {
    try {
        return await chatSchema.find({ _id: { $in: idChats } }).lean()
    } catch (error) {
        throw new Error(error.message)
    }
}

const obterChat = async (idChat) => {
    try {
        return await chatSchema.findOne({ _id: idChat })
    } catch (error) {
        throw new Error(error.message)
    }    
}

const salvarMensagens = async (idChat, mensagem) => {
    try {
        return await chatSchema.findOneAndUpdate(
            { _id: idChat },
            { $push: { mensagens: { $each: mensagem } } },
          )
    } catch (error) {
        throw new Error(error.message)
    }   
}

const registrarNotificacao = async (idChat, idUser) => {
    try {
        chatSchema.findOne({ _id: idChat })
        .then(data => {
            if(idUser == data.usuarios[0].user.id){
                data.updateOne({ $inc: { "usuarios.0.user.notificacoes": 1 } })
                    .then(() => console.log("Foi")).catch(error => {new Error(error)})
            } else {
                data.updateOne({ $inc: { "usuarios.0.userTarget.notificacoes": 1 } })
                    .then(() => console.log("Foi")).catch(error => {new Error(error)})
            }
        })
        .catch(error => {new Error(error)})
    } catch (error) {
        throw new Error(error.message)
    }
}

const limparNotificacao = async (idChat, idUser) => {
    try {
        chatSchema.findOne({ _id: idChat })
        .then(data => {
            if(idUser == data.usuarios[0].user.id){
                data.updateOne({ "usuarios.0.user.notificacoes": 0 })
                    .then(() => console.log("limpou")).catch(error => {new Error(error)})
            } else {
                data.updateOne({ "usuarios.0.userTarget.notificacoes": 0 })
                    .then(() => console.log("limpou")).catch(error => {new Error(error)})
            }
        })
        .catch(error => {new Error(error)})
    } catch (error) {
        throw new Error(error.message)
    }
}

const adicionarGrupoEmUsuario = async (idChat, idUsuario) => {
    try {
        return await usuarioSchema.findOneAndUpdate({ _id: idUsuario }, { $push: { chats: {idChat: idChat, privado: false} } })
    } catch (error) {
        throw new Error(error.message)
    }    
}

const adicionarUsuarioEmGrupo = async (idChat, idUsuario) => {
    try {
        await adicionarGrupoEmUsuario(idChat, idUsuario)
            .then(async (response) => {
                return await chatSchema.findOneAndUpdate({ _id: idChat }, { $push: { usuarios: { id: idUsuario, nome: response.nome_completo } } })
            })
    } catch (error) {
        throw new Error(error.message)
    }    
}

const arquivarConversa = async (idChat) => {
    try {
        const chat = await obterChat(idChat)
        return await chat.updateOne({ arquivada: !chat.arquivada })
    } catch (error) {
        throw new Error(error.message)
    }     
}



const chatUsuario = async (idUser) => {
    try {
        return await chatSchema.find({
            $or: [
              { "usuarios.0.user.id": idUser },
              { "usuarios.0.userTarget.id": idUser }
            ]
          }).select({ usuarios: 1, _id: 0 })
    } catch (error) {
        throw new Error(error.message)
    }  
}




module.exports = {
    criarInstanciaChat,
    registrarNotificacao,
    limparNotificacao,
    obterChatsPorUsuario,
    obterChat,
    salvarMensagens,
    criarChatPublico,
    listarChatsPublicos,
    adicionarUsuarioEmGrupo,
    arquivarConversa,
    chatUsuario
}
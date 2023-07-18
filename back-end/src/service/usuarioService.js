const avisoSchema = require("../model/avisoSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")
const chatSchema = require("../model/chatSchema.js")
const chatService = require("../service/chatService.js")


const buscarUsuario = async (id) => {
    try {
        return await usuarioSchema.findOne({ _id: id })
    }
    catch (error) {
        return new Error("Falha ao encontrar usuário!")
    }
}

const buscarUsuarioPorEmail = async (email) => {
    try {
        return await usuarioSchema.findOne({ email: email })
    }
    catch (error) {
        return new Error("Falha ao encontrar usuário!")
    }
}

const editarUsuario = async (id, reqUserId, nome_completo, matricula, curso, celular, email, password) => {
    try {
        if(id != reqUserId) {
            return new Error({message: "Erro ao achar usuário"})
        }
        return await usuarioSchema.findByIdAndUpdate( { _id: id }, {
            nome_completo: nome_completo, matricula: matricula, curso: curso, celular: celular, email: email, password: password
        } )
    } catch (error) {
        throw new Error(error.message)
    }
}


const conteudosSalvos = async (id) => {
    try {
        return await usuarioSchema.findOne({ _id: id })
    } catch (error) {
        throw new Error(error.message)
    }
}

const obterUsuarios = async () => {
    try {
        return await usuarioSchema.find().lean()
    } catch (error) {
        throw new Error(error.message)
    }
}
   

const salvarFoto = async (id, url) => {
    try {
        buscarUsuario(id)
            .then(user => {
                return user.updateOne({ foto: url })
            })
            .catch(error => new Error(error))
    } catch (error) {
        throw new Error(error.message)
    }
}

const instanciarChatUsuario = async (privado, users, infosChat, userIds) => {
    try {
      const data = await chatService.criarInstanciaChat(privado, users);
      infosChat.idChat = data._id;
      const result = await usuarioSchema.updateMany(
        { _id: { $in: userIds } },
        { $push: { chats: infosChat } }
      );
      return {result, data};
    } catch (error) {
      throw new Error(error.message);
    }
  };

const instanciarChatPublico = async(privado, nome, tema, userAdmin, foto, idUsuario) => {
    try {
        await chatService.criarChatPublico(privado, nome, tema, userAdmin, foto)
            .then(async (data) => {
                const usuario = await buscarUsuario(idUsuario)
                return await usuario.updateOne({ $push: { chats: { idChat: data._id, privado: false } } })
            })
    } catch (error) {
        throw new Error(error.message, { Error: "Erro ao criar instância do chat público" })
    }
}

const excluirUsuario = async (email) =>{
    try {
    await buscarUsuarioPorEmail(email)
        .then(user => {
            return user.deleteOne({ email: email})
        })
    }  catch (error){
        console.log("Erro ao excluir usuário")
        }
    };

const coletarChats = async (idUsuario) => {
    try {
        const chatsFiltrados = []
        const idChats = []
        const usuarios = await usuarioSchema.find({ _id: idUsuario })
        const chatsDeUsuarios = usuarios.map(usuario => usuario.chats);
        chatsDeUsuarios[0].forEach(chat => {
            idChats.push(chat.idChat)
            if (chat.privado){
                if (chat.usuarios[0] == idUsuario) {
                    chatsFiltrados.push(chat.usuarios[1])
                } else if (chat.usuarios[1] == idUsuario) {
                    chatsFiltrados.push(chat.usuarios[0])
                }
            }
        })
        const chats = chatsFiltrados
        return {chats, idChats}
    } catch (error) {
        throw new Error(error.message, { Error: "Erro ao encontrar" })
    }   
}

const limparChatsEmUsuarios = async (idUsuario) => {
    try {
        const {chats} = await coletarChats(idUsuario)
        chats.forEach(async id => {
        const usuario = await usuarioSchema.findById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        const chatsNaoPrivados = usuario.chats.filter(chat => chat.usuarios && !chat.usuarios.includes(idUsuario));
        usuario.chats = chatsNaoPrivados;
        await usuario.save();
        })
    } catch (error) {
        throw new Error(error.message, { Error: "Erro ao encontrar" })
    }    
}

const deletarChats = async (idUsuario) => {
    try {
        const {idChats} = await coletarChats(idUsuario)
        idChats.forEach(async id => {
            return await chatSchema.findByIdAndDelete({ _id: id })   
        })

    } catch (error) {
        throw new Error(error.message, { Error: "Erro ao encontrar" })
    } 
}

const deletarUsuario = async (idUsuario) => {
    try {
        return await usuarioSchema.findByIdAndDelete({ _id: idUsuario })
    } catch (error) {
        throw new Error(error.message, { Error: "Erro ao encontrar" })
    }   
}


module.exports = {
    buscarUsuario,
    editarUsuario,
    conteudosSalvos,
    obterUsuarios,
    salvarFoto,
    instanciarChatUsuario,
    instanciarChatPublico,
    buscarUsuarioPorEmail,
    excluirUsuario,
    limparChatsEmUsuarios,
    deletarChats,
    deletarUsuario
}
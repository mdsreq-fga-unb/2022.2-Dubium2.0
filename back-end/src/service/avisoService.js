const avisoSchema = require("../model/avisoSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")
const usuarioService = require("../service/usuarioService.js")


const criarAviso = async (id_usuario, tituloAviso, corpoAviso, id_cursoAviso, filtro) => {
    try {
        const aviso = new avisoSchema({ titulo: tituloAviso, usuario: id_usuario, conteudo: corpoAviso, materia: filtro, curso: id_cursoAviso, data: Date.now() })
        return await aviso.save()
    } catch (error) {
        throw new Error(error.message)
    }
}

const buscarAvisos = async () => {
    try {
        return await avisoSchema.find().lean().sort({ data: -1 })
    } catch (error) {
        throw new Error(error.message)
    }
}

const buscarAvisoPorId = async (id) => {
    try {
        return await avisoSchema.findOne({ _id: id })
    } catch (error) {
        throw new Error(error.message)
    }
}

const editarAviso = async (id, idUser, titulo, materia, conteudo) => {
    return await avisoSchema.findOne({ _id: id})
        .then(async aviso => {
            if (aviso.usuario.id != idUser) {
                return res.status(403).send({
                    error: "Você não tem permissão para editar esse aviso."
                });
            }
            return await aviso.updateOne({titulo: titulo, materia: materia, conteudo: conteudo})
        })
        .catch(error => {throw new Error("Aviso não encontrado!")})
}



const deletarAviso = async (id, userId) => {
    return await avisoSchema.findOne({ _id: id })
      .then(data => {
        if (data.usuario.id == userId) {
          return data.deleteOne();
        } else {
          throw new Error("Usuário inválido");
        }
      });
  };

  const salvarAviso = async (id, idUser, salvo) => {
    try {
        usuarioService.buscarUsuario(idUser)
        .then(data => {
            if(salvo){
                return data.updateOne({ $push: { "salvos.avisos": id }})
            } else {
                return data.updateOne({ $pull: { "salvos.avisos": id } })
            }
        })
    } catch (error) {
        throw new Error(error.message)
    }
  }


  const avisosSalvos = async (arrayAvisos) => {
    try {
        return await avisoSchema.find({ _id: { $in: arrayAvisos } })
    } catch (error) {
        return new Error(error.message)
    }
  }

  const favoritarAviso = async (id, idUser, favorito) => {
    return await avisoSchema.findOne({ _id: id })
        .then(data => {
            if(favorito){
                return data.updateOne({ $inc: { votos: +1 }, $push: { "favoritadoPor": idUser } })
            } else {
                return data.updateOne({ $inc: { votos: -1 }, $pull: { "favoritadoPor": idUser } })
            }
        })
        .catch(error => {throw new Error("Aviso não encontrado!")})
  }


module.exports = {
    criarAviso,
    buscarAvisos,
    buscarAvisoPorId,
    deletarAviso,
    editarAviso,
    salvarAviso,
    avisosSalvos,
    favoritarAviso


}
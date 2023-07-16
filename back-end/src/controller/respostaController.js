const { json } = require("body-parser")
const express = require("express")
const router = express()
router.use(json())
const passport = require("passport")
const RespostaSchema = require("../model/respostaSchema.js")
const respostaSchema = require("../model/respostaSchema.js")
const respostaService = require("../service/respostaService.js")


router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { Usuario, idPergunta, conteudo } = req.body
    new RespostaSchema({ Usuario: Usuario, idPergunta: idPergunta, conteudo: conteudo, data: Date.now() }).save()
        .then(data => {
            res.status(201).send("Resposta criada com sucesso")
        })
        .catch(err => {
            res.status(401).send({
                error: "Erro ao criar resposta",
                message: err
            })
        })
})

router.get("/pergunta/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params
    RespostaSchema.find({ idPergunta: id }).lean()
        .then((data) => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(404).send({
                error: "Não foi possível achar respostas para esta pergunta",
                message: err
            })
        })


})

router.delete("/pergunta/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params
    respostaSchema.findOne({ _id: id })
        .then((resposta) => {
            if(resposta.Usuario.id == req.user._id){
                resposta.deleteOne()
                    .then(() => {
                        res.status(201).send({
                        message: "Resposta deletada com sucesso!"
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                        error: "Falha ao deletar resposta",
                        message: err
                        });
                    });          
            }
        })
        .catch(err => {
            res.status(404).send({
                error: "Falha ao procurar resposta",
                message: err
            })
        })
})

router.post("/favoritar/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    // const { id } = req.params
    const { idUsuario, idResposta, favorito } = req.body
    respostaSchema.findOne({ _id: idResposta })
        .then(data => {
            if(favorito){
                data.updateOne({ $inc: { votos: +1 }, $push: { "favoritadoPor": idUsuario } })
                    .then(() => {
                        res.status(201).send("Atualizado com sucesso!")
                    })
                    .catch(err => {
                        res.send({
                            error: "Erro ao atualizar favoritos",
                            message: err
                        })
                    })
            } else {
                data.updateOne({ $inc: { votos: -1 }, $pull: { "favoritadoPor": idUsuario } })
                    .then(() => {
                        res.status(201).send("Atualizado com sucesso!")
                    })
                    .catch(err => {
                        res.send({
                            error: "Erro ao atualizar favoritos",
                            message: err
                        })
                    })
            }
        })
        .catch(err => {
            res.status(404).send({
                error: "Falha ao procurar resposta",
                message: err
            })
        })
})

router.put("/editar/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params
  const { conteudo } = req.body
  respostaService.editarResposta(id, req.user._id, conteudo)
    .then(updatedResposta => {
      res.status(200).json(updatedResposta)
    })
    .catch(err => {
      res.status(500).send({
        error: "Erro ao atualizar resposta",
        message: err.message
      })
    })
})




module.exports = router
const { json } = require("body-parser")
const express = require("express")
const router = express()
router.use(json())
const passport = require("passport")
const RespostaSchema = require("../model/respostaSchema.js")
const respostaSchema = require("../model/respostaSchema.js")
const respostaService = require("../service/respostaService.js")
const openaiService = require("../service/openaiService.js")



router.put("/editar", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { idResposta, novoConteudo } = req.body
    try {
        const data = await openaiService.analisarConteudoPost(novoConteudo);
        const verificacao = data.data.choices[0].message.content;
        if (verificacao === 'False' || verificacao === 'false') {
            throw new Error("Conteúdo impróprio ou não condiz com o objetivo deste fórum");
        }
        await respostaService.editarResposta(idResposta, novoConteudo)
        res.status(200).send("Resposta editada com sucesso")
    } catch (err) {
        res.status(404).send({ error: "Erro ao editar resposta", message: err.message });
    }
})

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Usuario, idPergunta, conteudo } = req.body
    let conteudoResposta = `${conteudo}`
    try {
        const data = await openaiService.analisarConteudoPost(conteudoResposta);
        const verificacao = data.data.choices[0].message.content;
        if (verificacao === 'False' || verificacao === 'false') {
            throw new Error("Conteúdo impróprio ou não condiz com o objetivo deste fórum");
        }
        await new RespostaSchema({ Usuario: Usuario, idPergunta: idPergunta, conteudo: conteudo, data: Date.now() }).save()
        res.status(201).send("Resposta criada com sucesso")
    } catch (err) {
        res.status(401).send({error: "Erro ao criar resposta", message: err.message })
    }
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





module.exports = router
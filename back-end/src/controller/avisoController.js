const { json } = require("body-parser")
const avisoSchema = require("../model/avisoSchema.js")
const perguntaSchema = require("../model/perguntaSchema.js")
const usuarioSchema = require("../model/usuarioSchema.js")
const avisoService = require("../service/avisoService.js")
const openaiService = require("../service/openaiService.js")


const criarAviso = async (req, res) => {
    const { id_usuario, tituloAviso, corpoAviso, id_cursoAviso, filtro } = req.body
    let conteudoAviso = `${filtro}, ${tituloAviso}, ${corpoAviso}`

    try {
        const data = await openaiService.analisarConteudoPost(conteudoAviso);
        const verificacao = data.data.choices[0].message.content;
        if (verificacao === 'False' || verificacao === 'false') {
            throw new Error("Conteúdo impróprio ou não condiz com o objetivo deste fórum");
        }
        await avisoService.criarAviso(id_usuario, tituloAviso, corpoAviso, id_cursoAviso, filtro)
        res.status(201).send("Aviso criado com sucesso!")
    } catch (err) {
        res.status(400).send({ error: "Erro ao criar aviso!", message: err.message })
    }
}

const editarAviso = async (req, res) => {
    const { id } = req.params;
    const { titulo, materia, conteudo } = req.body;
    let conteudoAviso = `${materia}, ${materia}, ${conteudo}`

    try {
        const data = await openaiService.analisarConteudoPost(conteudoAviso);
        const verificacao = data.data.choices[0].message.content;
        if (verificacao === 'False' || verificacao === 'false') {
            throw new Error("Conteúdo impróprio ou não condiz com o objetivo deste fórum");
        }
        const updatedAviso = await avisoService.editarAviso(id, req.user._id, titulo, materia, conteudo)
        res.status(200).json(updatedAviso);
    } catch (err) {
        res.status(500).send({ error: "Erro ao atualizar aviso", message: err.message })
    }
}

const buscarAvisos = (req, res) => {
    avisoService.buscarAvisos()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(404).send({ error: "Avisos não encotrados", message: err })
        })
}

const buscarAvisoPorId = (req, res) => {
    const { id } = req.params
    avisoService.buscarAvisoPorId(id)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(404).send({ error: "Aviso não encontrado", message: err })
        })
}

const deletarAviso = (req, res) => {
    const { id } = req.params
    avisoService.deletarAviso(id, req.user._id)
        .then(() => res.status(201).send("Deletado com sucesso"))
        .catch(err => res.status(400).send({ error: "Falha ao deletar aviso", message: err }));
}


const salvarAviso = (req, res) => {
    const { id_usuario, id_aviso, salvo } = req.body
    avisoService.salvarAviso(id_aviso, id_usuario, salvo)
        .then(() => {
            res.status(201).send("Aviso alterado com sucesso!")
        })
        .catch(err => {
            res.status(400).send({
                error: "Erro ao alterar aviso!",
                message: err
            })
        })
}

const avisosSalvos = (req, res) => {
    const { arrayAvisos } = req.body
    avisoService.avisosSalvos(arrayAvisos)
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

const favoritarAviso = (req, res) => {
    const { idUsuario, idAviso, favorito } = req.body
    avisoService.favoritarAviso(idAviso, idUsuario, favorito)
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
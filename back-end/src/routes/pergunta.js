
const express = require('express');
const router = express.Router();
router.use(express.json());
const passport = require('passport');
const perguntaController = require('../controller/perguntaController');

router.post("/", passport.authenticate('jwt', { session: false }), perguntaController.criarPergunta)
router.get("/view", perguntaController.obterPerguntas)
router.get("/:id", passport.authenticate('jwt', { session: false }), perguntaController.obterPerguntaPorId)
router.delete("/:id", passport.authenticate('jwt', { session: false }), perguntaController.deletarPergunta)
router.post("/favoritar/:id", passport.authenticate('jwt', { session: false }), perguntaController.favoritarPergunta)
router.post("/salvar", passport.authenticate('jwt', { session: false }), perguntaController.salvarPergunta)
router.post("/salvos", passport.authenticate('jwt', { session: false }), perguntaController.perguntasSalvas)
router.post("/favoritos", passport.authenticate('jwt', { session: false }), perguntaController.perguntasCadastradas)


module.exports = router;
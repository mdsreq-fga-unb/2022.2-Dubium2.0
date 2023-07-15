const express = require('express');
const router = express.Router();
router.use(express.json());
const passport = require('passport');
const chatController = require("../controller/chatController.js")


// router.post("/criar", passport.authenticate('jwt', { session: false }), avisoController.criarAviso)
router.post("/", passport.authenticate('jwt', { session: false }), chatController.obterChatsPorUsuario)
router.get("/:idChat", passport.authenticate('jwt', { session: false }), chatController.obterChat)
router.post("/messages", passport.authenticate('jwt', { session: false }), chatController.salvarMensagens)
router.post("/chatPublico", passport.authenticate('jwt', { session: false }), chatController.instanciarChatPublico)
router.get("/", passport.authenticate('jwt', { session: false }), chatController.listarChatsPublicos)
router.post("/joinUser", passport.authenticate('jwt', { session: false }), chatController.adicionarUsuarioEmGrupo)

module.exports = router;
const express = require('express');
const router = express.Router();
router.use(express.json());
const passport = require('passport');
const usuarioController = require("../controller/usuarioController")
const openai = require("../config/OpenaiConfig.js")


router.get("/fotos", usuarioController.obterFotos)
router.get("/:id", passport.authenticate('jwt', { session: false }), usuarioController.buscarUsuario)
router.post("/editar/:id", passport.authenticate('jwt', { session: false }), usuarioController.editarUsuario)
router.get("/salvos/:id", passport.authenticate('jwt', { session: false }), usuarioController.conteudosSalvos)
router.get("/", passport.authenticate('jwt', { session: false }), usuarioController.obterUsuarios)
router.post("/salvarFoto", passport.authenticate('jwt', { session: false }), usuarioController.salvarFoto)
router.post("/chatInstance", passport.authenticate('jwt', { session: false }), usuarioController.instanciarChatUsuario)
router.post("/deletar", passport.authenticate('jwt', { session: false }), usuarioController.deletarUsuario)



module.exports = router;
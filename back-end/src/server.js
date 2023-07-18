const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
const http =  require('http').createServer(app)
const openai = require("./config/OpenaiConfig.js")


//redis
const client = require("./config/RedisConfig.js")

//rotas
const cadastro = require("./controller/cadastroController.js")
const login = require("./controller/loginController.js")
const pergunta = require("./routes/pergunta.js")
const resposta = require("./controller/respostaController.js")
const usuario = require("./routes/usuario.js")
const aviso = require("./routes/aviso.js")
const chat = require("./routes/chat.js")
//require mongo
require("./config/MongoConfig.js")
//require cors
const cors = require("cors")
const corsPort = {
    credentials: true,
    origin: ["https://dubium2.vercel.app"],
}
app.use(cors(corsPort))
//cookie
app.use(cookieParser())

app.use("/pergunta", pergunta)
app.use("/cadastro", cadastro)
app.use("/login", login)
app.use("/resposta", resposta)
app.use("/usuario", usuario)
app.use("/aviso", aviso)
app.use("/chat", chat)



module.exports = http;

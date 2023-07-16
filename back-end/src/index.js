require('dotenv').config()

//configs server
const http = require('./server.js')

//socket
require("./config/sockets.js")


const port = 8080

// const startup = async() => {
//     await client.connect()
//     .then(() => {console.log("conectou redis")})
// }

// startup()

const server = http.listen(port, () => {
    console.log(`O servidor está rodando em: http://localhost:${port}`)
})

module.exports = server;

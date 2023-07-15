const redisClient = require("../config/RedisConfig.js")


const salvarMensagensCache = async (idChat, chatData) => {
    const chatString = JSON.stringify(chatData);
    await redisClient.set(idChat, chatString, (err) => {
        if (err) {
          console.error(err);
          reject("Erro ao salvar as mensagens no cache");
        }
    }) 
    .then(async () => {
        await redisClient.expire(idChat, 300)
    })
  }
  


module.exports = {
    salvarMensagensCache
}
const openai = require("../config/OpenaiConfig.js")

const parametrosTexto = `Faça a análise do conteúdo do corpo de mensagem (content:, corrija erros de ortografia antes), se e somente se o conteúdo for relacionado a estudos, 
debates e discussões sobre coisas que não façam apologias como animies e etc, retorne true, qualquer outro tipo de conteúdo impróprio retorne false. 
(retorne uma resposta binária, true ou false, apenas) CONTENT: `

const analisarConteudoPost = async (conteudo) => {
    try {
        return await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: parametrosTexto + conteudo,
                }
            ],
            temperature: 0.2
        })
    } catch (error) {
        console.log(error)
    }
}

const analisarMensagem = async (conteudo) => {
    try {
        return await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Com 150 tokens, disserte sobre: " + conteudo,
                }
            ],
            max_tokens: 150
        })
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    analisarConteudoPost,
    analisarMensagem
}
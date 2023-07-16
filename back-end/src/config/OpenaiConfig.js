const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config()


const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


module.exports = openai
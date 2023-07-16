const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config()


const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);


module.exports = openai
const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
    organization: "org-ZKypXgICyNRD0O6urMB1v5Eh",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


module.exports = openai
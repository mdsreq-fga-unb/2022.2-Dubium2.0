const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
    organization: "org-ZKypXgICyNRD0O6urMB1v5Eh",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


module.exports = openai
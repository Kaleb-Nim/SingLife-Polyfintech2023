const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Auth for chatgpt
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-iMqAYEKIdfTtaHv3MMbIb8Zy",
    apiKey: "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 ",
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// create a stable express api that calls the function above
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

app.post('/', async (req, res) => {
    const {message} = req.body;
    console.log(message, "message");

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${message}`,
        max_tokens: 7,
        temperature: 0.5,
    }); 

    // console.log(response.data.choices[0].text);
    res.json({
        message: response.data.choices[0].text
    })
})

app.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
})
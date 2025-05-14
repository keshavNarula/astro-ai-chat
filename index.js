const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

// POST endpoint for the /ask route
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).send({ error: 'Question is required' });
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 50,
    });

    res.json({ answer: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching data from OpenAI.' });
  }
});

// Listen on the dynamic port provided by Render
const port = process.env.PORT || 10000; // Use dynamic port provided by Render
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

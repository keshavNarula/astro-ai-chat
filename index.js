const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');  // OpenAI library

const app = express();
app.use(bodyParser.json());

// Set the port dynamically for Render (it automatically assigns the port)
const PORT = process.env.PORT || 10000;

// Initialize OpenAI API with your key
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Create endpoint for handling questions
app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  try {
    // Call OpenAI API for a response
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // You can change the model if needed
      prompt: question,
      max_tokens: 100,
    });

    // Send response back to the client
    res.json({ answer: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing your question' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

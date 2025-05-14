const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai'); // Ensure you have the OpenAI client set up properly

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000; // Use the Render-provided port or default to 10000

app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  // Here you integrate OpenAI API (ensure your OpenAI API key is correct)
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003', // Or whichever model you want
      prompt: question,
      max_tokens: 100,
    });
    res.json({ answer: response.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing your question' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

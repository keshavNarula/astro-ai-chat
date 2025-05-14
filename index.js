const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to handle retries
async function getCompletionWithRetry(question, retries = 3, delay = 1000) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });
    return completion.data.choices[0].message.content; // Return the content if successful
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      // If rate limit is exceeded, retry after waiting
      console.log('Rate limit exceeded, retrying...');
      await new Promise(res => setTimeout(res, delay)); // Wait for the delay time
      return getCompletionWithRetry(question, retries - 1, delay); // Retry the request
    } else {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error; // If not a rate limit error or no retries left, throw the error
    }
  }
}

app.get('/', (req, res) => {
  res.send('Astro AI Chat Server is Live ✅');
});

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const answer = await getCompletionWithRetry(question); // Call the retry logic function
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

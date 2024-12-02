const { Configuration, OpenAIApi } = require('openai');
const pdf = require('pdf-parse');
const systemPrompt = require('./data/aiSystemAgentStartingPromt');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

const openai = new OpenAIApi(configuration);

async function setUpAgent() {
  // Load the PDF content and append it to the system prompt
  const data = await pdf('./data/flipped.pdf');
  const PDFcontent = data.text;
  return systemPrompt + PDFcontent;
}

// Function to send a question to OpenAI
async function sendQuestionToOpenAI(questionFromUser) {
  // Type checking
  if (!questionFromUser || typeof questionFromUser !== 'string') {
    throw new Error(
      "Invalid input: 'questionFromUser' must be a non-empty string."
    );
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: await setUpAgent() },
        { role: 'user', content: questionFromUser },
      ],
    });

    return completion.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    throw new Error('Failed to communicate with OpenAI API.');
  }
}

module.exports = { sendQuestionToOpenAI };

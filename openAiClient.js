const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

//Load data from the PDF into this variable
const PDFcontent = "";
const setupPromt = require("./data/aiSystemAgentStartingPromt") + PDFcontent;

// Function to send a question to OpenAI
async function sendQuestionToOpenAI(questionFromUser) {
  //type checking
  if (!questionFromUser || typeof questionFromUser !== "string") {
    throw new Error(
      "Invalid input: 'questionFromUser' must be a non-empty string."
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: setupPromt },
        { role: "user", content: questionFromUser },
      ],
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating chat response:", error.message);
    throw new Error("Failed to communicate with OpenAI API.");
  }
}

/**
 * A function to test the OpenAI API.
 *
 * This function will terminate the program if the OpenAI API fails.
 *
 * How to use:
 * - Ensure you have set up your OpenAI API key in a `.env` file.
 * - The function sends a predefined prompt to the OpenAI API and logs the response.
 *
 * If the API fails, the program will terminate with an error message.
 */
async function testOpenAiAPI() {
  try {
    const prompt = "Hello this is a test";
    const response = await sendQuestionToOpenAI(prompt);
    console.log("API Response:", response);
  } catch (error) {
    console.error("Critical Error:", error.message);
    process.exit(1);
  }
}

module.exports = { sendQuestionToOpenAI };
module.exports = { testOpenAiAPI };

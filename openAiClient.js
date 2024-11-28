const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

// TODO read input from PDF instead
const setupPromt = `You will recieve a text from a pdf document about a course, 
                    you should read this information and come up with a suggestions 
                    for a weekly schedule.`;

async function sendQuestionToOpenAI(questionFromUser) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: setupPromt },
        { role: "user", content: questionFromUser },
      ],
    });

    return completion.choices[0].message.content; // Return the generated response
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}

async function testAPIConnection() {
  const testSystemPromt =
    "This is just a connection test, you should reply with only success if it's working";
  const testQuestion = "Do you work?";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: testPromt },
        { role: "user", content: testQuestion },
      ],
    });
    return completion.choices[0].message.content; // Return the generated response
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}

module.exports = { sendQuestionToOpenAI };
module.exports = { testAPIConnection };

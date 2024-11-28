const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});


const setupPromt = "You will recieve a text from a pdf document about a course, you should read this information and come up with a suggestions for a weekly schedule."


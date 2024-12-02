const router = require("express").Router();
const { sendQuestionToOpenAI } = require("../openAiClient");

// Function to get user input and then send a question to OpenAI
router.post("/addUserText", async (req, res) => {
  try {
    // Get the user input from the request body
    const userInput = req.body.userInput;
    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }
    
    // Send the user input to OpenAI
    const aiAnswer = await sendQuestionToOpenAI(userInput);
    // Return the response from OpenAI
    res.json(aiAnswer);

  } catch (error) {
    console.error("Error processing request: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// This always has to be at the end of the file
module.exports = router;
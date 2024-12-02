//Basic server setup

const express = require("express");
const path = require("path");
const app = express();
const listenPost = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Listen to port 3000
app.listen(listenPost, () => {
  console.log(`Server is running on port ${listenPost}`);
});

//Routes
app.use("/API", require("./routes/API"));
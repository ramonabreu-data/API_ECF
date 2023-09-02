// Import packages
const express = require("express");
const home = require("./routes/home/home");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);


// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
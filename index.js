const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const dotenv = require("dotenv").config({ path : __dirname+'/./config/.env'});

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

// dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors()
);

app.use("/posts", postRoutes);
app.use("/user", userRoutes);
// 1)

app.get("/", (req, res) => {
  res.send("Hello to memories API");
});

const PORT = process.env.PORT ;
 
mongoose
  .connect( //mongodb+srv://Mazin:Mazin1234@cluster0.zlw6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    process.env.CONNECTION_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(PORT, () => console.log(process.env.CONNECTION_URL)))
  .catch((error) => console.log(`error: ${error}`)); 

// mongoose.set('useFindAndModify', false); //make sure not getting any warning in the console

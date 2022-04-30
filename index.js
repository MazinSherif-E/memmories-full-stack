const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const postRoutes = require('./routes/posts'); 
const userRoutes = require('./routes/user');

const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes)
app.use('/user', userRoutes)
// 1) 


app.get('/', (req, res)=>{ 
    res.send("Hello to memories API")
})


const PORT = process.env.PORT;
  
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(`error: ${error}`));

// mongoose.set('useFindAndModify', false); //make sure not getting any warning in the console 


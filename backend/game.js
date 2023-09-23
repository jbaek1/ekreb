const axios = require('axios');
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const spanishapiKey = "df54b74a-aa8a-486e-9ca5-b7d4f5a78696";
const englishapiKey = "fee61e05-f4cf-474f-a0df-0321ee82e887";
let word;
app.use(cors());

let score;
let accuracy;
let round;
let numcorrect;
let bestscore;
let scrambled;

app.get("/start", (req, res) => {
    score = 0;
    accuracy = 0.0;
    round = 1;
    numcorrect = 0;
    bestscore = 0;
    res.status(200).send("true");
});

app.get("/score", (req, res) => {
  res.send(`${score}`);
});
app.get("/accuracy", (req, res) => {
    res.send(`${accuracy}`);
  });
  app.get("/round", (req, res) => {
    res.send(`${round}`);
  });

app.patch("/scorecorrect", (req, res) => {
res.status(200).send(`${score}`);
});

 
async function getWords(req, res) {
    // Difficulties are easy, medium, difficult, languages en or es
   let response;
    if ((req.query.language == "es")) {
        if (req.query.difficulty == "easy") { 
            length =  (Math.floor(Math.random() * (5)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${req.query.language}`);
          } else if (req.query.difficulty == "medium") { 
            length =  (Math.floor(Math.random() * (10)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${req.query.language}`);
          } else if (req.query.difficulty == "difficult") { 
            length = (Math.floor(Math.random() * (15)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${req.query.language}`);
          }
    }
    else{
        if (req.query.difficulty == "easy") { 
            length = (Math.floor(Math.random() * (5)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}`);
          } else if (req.query.difficulty == "medium") { 
            length =  (Math.floor(Math.random() * (10)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}`);
          } else if (req.query.difficulty == "difficult") { 
            length = (Math.floor(Math.random() * (15)) + 5);
            response = await axios.get(`https://random-word-api.herokuapp.com/word?length=${length}`);
          }
    }
    word = response.data[0];
    //scramble word
    scrambled = word.split('').sort(() => Math.random() - 0.5).join('')
    res.json({word, scrambled});
  }

app.get("/getWord", (req, res) => {
    getWords(req,res);
});

async function getHint(req, res) {
    let hint = ""; // Declare the hint variable and initialize it

    // Difficulties are easy, medium, difficult, languages en or es
    if (req.query.language == "es") {
        try {
            const response = await axios.get(
                "https://www.dictionaryapi.com/api/v3/references/spanish/json/" + word + "?key=" + spanishapiKey
            );
            hint = response.data[0].shortdef[0];
        } catch (error) {
            console.log(error);
            hint = "No hint available from Merriam Webster Spanish Dictionary";
        }
    } else {
        try {
            response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/sd3/json/${word}?key=${englishapiKey}`);
            hint = response.data[0].shortdef[0]
        } catch (error) {
            console.log(error);
            hint = "No hint available from Merriam Webster English Dictionary";
        }
    }
    res.status(200).send(`${hint}`);
}


app.get("/getHint", (req, res) => {
  getHint(req,res);
});

app.patch("/guessWord", (req, res) => {
  if (req.query.word === word) {
    numcorrect++;
    accuracy = Math.round(numcorrect / round * 100);
    if (score > bestscore) {
        bestscore = score;
    }
    if (req.query.difficulty == "easy") {
        score += 1;
      }
      if (req.query.difficulty == "medium") {
          score += 2;
      }
      if (req.query.difficulty == "medium") {
        score += 3;
      }
    res.status(200).send("true");
  } else {
    res.status(200).send("false");
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

app.get("/newgame", (req, res) => {
    score = 0;
    accuracy = 0.0;
    round = 1;
    numcorrect = 0;
    res.status(200).send("true");
});

app.get("/gamestats", (req, res) => {
    res.json({score, accuracy});
});
app.get("/endgame", (req, res) => {
    score = 0;
    round = 1;
    numcorrect = 0;
    res.status(200).send("true");});

    app.get("/getCurrentWord", (req, res) => {
        res.status(200).send(word);
      });
app.patch("/setDifficulty", (req, res) => {
    if (req.query.difficulty == "easy") {
        difficulty = "easy";
      }
      if (req.query.difficulty == "medium") {
        difficulty = "medium";
      }
      if (req.query.difficulty == "difficult") {
       difficulty = "difficult"
      }
    res.status(200).send("true");
});




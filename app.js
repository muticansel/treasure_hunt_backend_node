import express from 'express';
import cors from 'cors';

// Set up the express app
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8080;

let board = Array(25).fill("")
let treasureInd = [];
let closestInd = [];
let secondInd = [];
let scores = []
for (let i = 0; i < 3; i++) {
  const ind = Math.round(Math.random() * 25)
  board[ind] = 'T';
  treasureInd.push(ind);
}

treasureInd.sort((a, b) => a - b)
treasureInd.forEach(ind => {
  if (ind % 5 !== 0 && board[ind - 1] === "") {
    closestInd.push(ind - 1)
    board[ind - 1] = "3";
  }
  if ((ind + 1) % 5 !== 0 && board[ind + 1] === "") {
    closestInd.push(ind + 1)
    board[ind + 1] = "3"
  }
  if (ind + 5 < 25 && board[ind + 5] === "") {
    closestInd.push(ind + 5)
    board[ind + 5] = "3"
  }
  if (ind - 5 >= 0 && board[ind - 5] === "") {
    closestInd.push(ind - 5)
    board[ind - 5] = "3"
  }
})

closestInd.sort((a, b) => a - b)
closestInd.forEach(i => {
  if (i % 5 !== 0 && board[i - 1] === "") {
    secondInd.push(i - 1)
    board[i - 1] = "2";
  }
  if ((i + 1) % 5 !== 0 && board[i + 1] === "") {
    secondInd.push(i + 1)
    board[i + 1] = "2"
  }
  if (i + 5 < 25 && board[i + 5] === "") {
    secondInd.push(i + 5)
    board[i + 5] = "2"
  }
  if (i - 5 >= 0 && board[i - 5] === "") {
    secondInd.push(i - 5)
    board[i - 5] = "2"
  }
})
secondInd.sort((a, b) => a - b)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

app.post('/api/startGame', function (req, res) {
  if (!req.body.playerName) {
    res.status(400).send({
      err: "Player Name cannot be found"
    })
  } else {
    res.status(200).send({
      message: "Game can be started"
    })
  }
})

app.post('/api/guess', (req, res) => {
  const guesses = req.body.guesses
  res.status(200).send({
    answers: [board[guesses[0]], board[guesses[1]], board[guesses[2]]]
  })
})

app.post('/api/newGame', (req, res) => {
  scores.push({ name: req.body.playerName, turn: req.body.turn })
  res.status(200)
})

app.get('/api/top10', (req, res) => {
  scores.sort((a, b) => a.turn - b.turn || a.name.localeCompare(b.name))

  res.status(200).send({
    top10: scores.slice(0,10)
  })
})
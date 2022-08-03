const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_PORT } = process.env;

const {
  seed,
  getPlayers,
  choosePlayer,
  deletePlayer,
} = require("./controller.js");
app.use(express.json());
app.use(cors());

// SEED FUNCTION
app.post("/seed", seed);

// GET ALL PLAYERS
// UPDATE PLAYER
// DELETE PLAYER FROM TEAM

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));

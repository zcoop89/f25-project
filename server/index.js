const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const { SERVER_PORT } = process.env;
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const { seed, getPlayers, choosePlayer } = require("./controller.js");

// SEED FUNCTION
app.post("/api/seed", seed);
// GET ALL PLAYERS
app.get("/api/players", getPlayers);
// CHOOSE PLAYER FOR TEAM
app.put("/api/players", choosePlayer);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));

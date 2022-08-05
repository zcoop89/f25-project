const pointGuardList = document.getElementById("point-guard");
const shootingGuardList = document.getElementById("shooting-guard");
const smallForwardList = document.getElementById("small-forward");
const powerForwardList = document.getElementById("power-forward");
const centerList = document.getElementById("center");
const pointGuardListTotal = document.getElementById("point-guard-total");
const shootingGuardListTotal = document.getElementById("shooting-guard-total");
const smallForwardListTotal = document.getElementById("small-forward-total");
const powerForwardListTotal = document.getElementById("power-forward-total");
const centerListTotal = document.getElementById("center-total");
const totalPointsPerGame = document.getElementById("total-points-per-game");

// This is a reusable function that will reset the game board
// when called
function resetBoard() {
  pointGuardList.innerHTML = "";
  shootingGuardList.innerHTML = "";
  smallForwardList.innerHTML = "";
  powerForwardList.innerHTML = "";
  centerList.innerHTML = "";
}

// when someone clicks on a player this function is called
async function handlePlayerClick(player) {
  await axios
    .put("http://localhost:4004/api/players", {
      player,
    })
    .then((res) => {
      // when the response comes back, we reset the game board
      resetBoard();
      // we also update the totals
      updateTotals(res.data);
      // and then we rebuild the UI with all the players with the
      // updated data
      res.data.map(buildPlayerButton);
    });
}

// This is simply a get function to map the correct
// containers to the position id
function getPostionList(position_id) {
  switch (position_id) {
    case 1:
      return pointGuardList;
    case 2:
      return shootingGuardList;
    case 3:
      return smallForwardList;
    case 4:
      return powerForwardList;
    default:
      return centerList;
  }
}

// This is a get function to map the correct
// container totals for each position id
function getPositionTotal(position_id) {
  switch (position_id) {
    case 1:
      return pointGuardListTotal;
    case 2:
      return shootingGuardListTotal;
    case 3:
      return smallForwardListTotal;
    case 4:
      return powerForwardListTotal;
    default:
      return centerListTotal;
  }
}

// This function updates all the totals
// when called
function updateTotals(players) {
  // for each position id (1 - 5), we need to loop thru
  // each position and get the total for each position
  [1, 2, 3, 4, 5].forEach((position_id) => {
    const totalPPG = players.reduce((total, player) => {
      // if the player is selected and the position id is the same for the one
      // we are currently looping on, add the total
      if (player.is_selected && player.position_id === position_id)
        total + player.ppg;
      // if the position id is not the same and the person is not selected, just return
      /// the total that is already there
      else return total;
    }, 0);
    // This will get the DIV that belongs to the current position id and add the total to it
    getPositionTotal(position_id).innerText = totalPPG;
  });
  // Now we need to get the total points
  let totalPoints = 0;
  // grab all the selected players, by filtering out players who are selected (is_selected)
  const selectedPlayers = players.filter((player) => player.is_selected);
  // then we need to loop thru the selected players and sum their PPG
  selectedPlayers.forEach((player) => (totalPoints += player.ppg));
  // once we have the total we need to add it to the total points DIV
  totalPointsPerGame.innerText = totalPoints.toFixed(2);
}

function buildPlayerButton(player) {
  // first we create a button for the player
  const playerButton = document.createElement("button");
  // then we add the css class 'player'
  playerButton.classList.add("player");
  // if the player is selected , we add the selected class and then add that players
  /// PPG to the position total for the PPG since only one can ever be selected
  if (player.is_selected) {
    playerButton.classList.add("isSelected");
    getPositionTotal(player.position_id).innerText = player.ppg;
  }
  // we set the button text to be the players display name
  playerButton.innerText = player.display_name;
  // we then add an event listener for clicking the button, when clicked
  // we pass handlePlayerClick our player they chose
  playerButton.addEventListener("click", () => handlePlayerClick(player));
  // we then add the person to the UI once they are built
  getPostionList(player.position_id).appendChild(playerButton);
}

// This simply grabs all players for to build the board
function getAllPlayers() {
  axios.get("http://localhost:4004/api/players").then((res) => {
    // once players are returned from server, we need to make sure totals are updated
    updateTotals(res.data);
    // this will build the player button for each player in the response from the server
    res.data.map(buildPlayerButton);
  });
}

// To start the game, this needs to run to get all players and build the UI
getAllPlayers();
var players = [
  {
    name: "Buffy",
    image: "./assets/images/gem_1.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
  {
    name: "Mario",
    image: "./assets/images/gem_2.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
  {
    name: "Daisy",
    image: "./assets/images/gem_3.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
  {
    name: "Sam",
    image: "./assets/images/gem_4.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
  {
    name: "Tom",
    image: "./assets/images/gem_5.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
  {
    name: "Bob",
    image: "./assets/images/gem_6.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
  },
]
// ===== Variables =======================
var playerCharacter = null;
var opponentCharacter = null;
var gamesWon = 0;
var gamesLost = 0;
var maxJewels = 0;


/**
 * Returns a random number between (and including) the two limits.
 * @param {*} min 
 * @param {*} max 
 */
const getRandomNumber = (min,max) => {
  if (min > max) {
    [min, max] = [max, min];  // swap the values if min > max
  }
  var numberSpan = max - min + 1;
  return Math.floor(Math.random()*numberSpan) + min;
}

/**
 * Assign health, attackIncrease and attackPower values to each player
 */
const initializePlayers = () => {
  players.forEach((p) => {
    p.health = getRandomNumber(100, 200);
    p.attackIncrease = getRandomNumber(5,10);
    p.attackPower = getRandomNumber(10, 25);
  })
}


// =====  JQUERY Start --- the following is the same as $(document).ready(function() {})
$(function() {
  // disable player clicks until start button is clicked
  $("#player-box").css('pointer-events', 'none'); // disable

  initializePlayers();
  console.log(players);

  const createPlayers = () => {
    var $playerArea = $("#player-box");
    $playerArea.empty();
    for (var i = 0; i < players.length; i++) {
      console.log(players[i]);
      $playerArea.append(`<img id="player-${i}" class="p2 player-image" src=${players[i].image} >`);
    }
  }

  // ===== Jewel click ===================
  // Use the last character(s) of id name to get the index to use for 
  // the jewels array.  All id names begin with 'jewel-'
  $("#player-box").on("click", function(e) {
    var index = e.target.id.slice(7);
    console.log(index);
    console.log(playerCharacter);

    if (playerCharacter === null) {
      playerCharacter =  players[index];
      $(`#player-${index}`).remove();
    } else if (opponentCharacter === null) {
      opponentCharacter = players[index];
      $(`#player-${index}`).remove();
    }
    console.log('player: ' + playerCharacter.name);
    console.log('opponent: ' + opponentCharacter.name);

    // If both players have been chosen, disable the remaining characters
    if (playerCharacter  != null && opponentCharacter != null) {
      $("#player-box").css('pointer-events', 'none'); // disable
    }
  })


  // PROBABLY SHOULD HAVE A CLICK BUTTON TO START GAME....
  const runGame = () => {
    $("#player-box").css('pointer-events', 'auto'); // enable
    $("#disp-msg").html("<h1>CHOOSE YOUR CHARACTER</h1>");
   
  }


  // START THE GAME
  createPlayers();
  runGame();
  
})


  // THE FOLLOWING LINES WILL DISABLE/ENBLE THE CLICKABLE PLAYER-BOX
    // $("#player-box").css('pointer-events', 'none'); // disable
    // $("#player-box").css('pointer-events', 'auto'); // enable
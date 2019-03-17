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
  
 // Function that starts the game running
 function runGame() {
   $("#player-box").css('pointer-events', 'auto'); // enable
   $("#disp-msg").text("select character");
 }
 
  /**
 * Creates clickable images and puts them in the Player selection box
 */
  const createPlayers = () => {
    var $playerArea = $("#player-box");
    $playerArea.empty();
    for (var i = 0; i < players.length; i++) {
      console.log(players[i]);
      $playerArea.append(`<img id="player-${i}" class="p2 player-image" src=${players[i].image} >`);
    }
  }

  const attack = () => {
    console.log('hi-YA!');
    // reduce health of opponent by players counterattack value
    opponentCharacter.health -= playerCharacter.attackPower;
    playerCharacter.attackPower += playerCharacter.attackIncrease;
    playerCharacter.health -=  opponentCharacter.attackPower;
    $("#player-health").text(playerCharacter.health);
    $("#opponent-health").text(opponentCharacter.health);
    checkIfWin();
  }
  
  const checkIfWin = () => {
    if ( playerCharacter.health <= 0 ) {
      loseRound();
    } else if ( opponentCharacter.health <= 0) {
      winRound();
    }
  }

  const winRound = () => {
    $("#disp-msg").text("You Won the round \n Pick a new opponent");
    // pick new character
  }

  const loseRound = () => {
    $("#disp-msg").text("You Lost");
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
      $("#player-name").text(playerCharacter.name);
      $("#player-picture").html(`<img class="p2 player-image" src=${playerCharacter.image} >`);
      $("#player-health").text(playerCharacter.health);
      $(`#player-${index}`).remove();
      $("#disp-msg").text("select opponent");

    } else if (opponentCharacter === null) {
      opponentCharacter = players[index];
      $("#opponent-name").text(opponentCharacter.name);
      $("#opponent-picture").html(`<img class="p2 player-image" src=${opponentCharacter.image} >`);
      $("#opponent-health").text(opponentCharacter.health);

      $(`#player-${index}`).remove();
      $("#disp-msg").text("let the battle begin!");
      var $visibleButton = $("#btn-attack").attr("class").replace("invisible","visible");
      $("#btn-attack").attr("class", $visibleButton);
      $("#btn-attack").click(attack);
    }
    
    // If both players have been chosen, disable the remaining characters
    if (playerCharacter  != null && opponentCharacter != null) {
      $("#player-box").css('pointer-events', 'none'); // disable
    }
  })
  

  // ===== BEGIN GAME ====================
  // Add onclick function to button to start the game
  createPlayers();
  initializePlayers();
  runGame();
  console.log(players);
  
    
})


// THE FOLLOWING LINES WILL DISABLE/ENBLE THE CLICKABLE PLAYER-BOX
// $("#player-box").css('pointer-events', 'none'); // disable
// $("#player-box").css('pointer-events', 'auto'); // enable
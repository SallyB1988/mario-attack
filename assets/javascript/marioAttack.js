const players = [
  {
    name: "Mario",
    image: "./assets/images/mario.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "mario-audio",
  },
  {
    name: "Koopa",
    image: "./assets/images/koopa.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "koopa-audio",

  },
  {
    name: "Daisy",
    image: "./assets/images/daisy.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "daisy-audio",

  },
  {
    name: "Bowser",
    image: "./assets/images/bowser.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "bowser-audio",

  },
  {
    name: "Wario",
    image: "./assets/images/wario.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "wario-audio",

  },
  {
    name: "Yoshi",
    image: "./assets/images/yoshi.png",
    health: 0,
    attackIncrease: 0,
    attackPower:  0,
    soundId: "yoshi-audio",

  },
  {
      name: "Waluigi",
      image: "./assets/images/waluigi.png",
      health: 0,
      attackIncrease: 0,
      attackPower:  0,
      soundId: "waluigi-audio",
    },
    
  ]
  // ===== Variables =======================
  var playerCharacter = null;
  var opponentCharacter = null;
  var gamesWon = 0;
  var gamesLost = 0;
  var maxJewels = 0;
  var maxBattles = 3;
  var numBattles = 1;

  /**
   * Resets scores when game is restarted
   */
  const resetScores = () => {
    var gamesWon = 0;
    var gamesLost = 0;
    var maxJewels = 0;
    var maxBattles = 3;
    var numBattles = 1;
  }

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
      p.attackIncrease = getRandomNumber(3,6);
      p.attackPower = getRandomNumber(10, 25);
    })
  }
  
  
  // =====  JQUERY Start --- the following line is the same as $(document).ready(function() {})
  $(function() {
    $("#instructions").html(`
    <p class="instructions" >Each character has a random number of <b>health points</b>, <b>attack points</b> and <b>attack increase</b> points. When two players battle,
    they lower their opponents health points by their attack points value. The attack points of the character fighting for you
    then has his attack points incremented by their attack increase value. (The opponent's attack points value remains the same.)
    <br>Choose a character to fight for you. You must battle ${maxBattles} opponents to win the game.</p>`)

    // disable player clicks until start button is clicked
    $("#player-box").css('pointer-events', 'none'); // disable
    
    // Function that starts the game running
    function runGame() {
      $("#player-box").css('pointer-events', 'auto'); // enable
      $("#disp-msg").text("select your character");
    }
    
    // createa player inside a frame inside the player-box div
    const playerInFrame = (index) => {
      $("#player-box").append(`<div id="player-${index}" class="m-1 player-frame"></div>`);
      var $playerFrame = $(`#player-${index}`);
      $playerFrame.append(`<div class="text-center player-info">${players[index].name}</div>`);
      $playerFrame.append(`<img id="player-${index}" class="p-2 d-block mx-auto player-frame-image" src=${players[index].image} >`)
      $playerFrame.append(`<div class="text-center player-info">${players[index].health}</div>`);
    }
    
    /**
     * Creates clickable images and puts them in the Player selection box
     */
    const createPlayers = () => {
      var $playerArea = $("#player-box");
      $playerArea.empty();
      for (var i = 0; i < players.length; i++) {
        console.log(players[i]);
        playerInFrame(i);
      }
    }
    
    const attack = () => {
      if (playerCharacter === null && opponentCharacter === null) {
        // if both players are null, then this is really a request to play again
        var $visibleButton = $("#btn-attack");
        var hide = $visibleButton.attr("class").replace("visible","invisible");
        console.log(hide);
        $visibleButton.text("Attack")
        $visibleButton.attr("class", hide);

        clearAllRegions();
        console.log('numBattles is '+numBattles);
        startPlaying();
      } else {
        console.log('here' + opponentCharacter);
        // This situation is really a battle between two characters
        // reduce health of opponent by players counterattack value
        opponentCharacter.health -= playerCharacter.attackPower;
        playerCharacter.attackPower += playerCharacter.attackIncrease;
        playerCharacter.health -=  opponentCharacter.attackPower;
        $("#player-health").text(playerCharacter.health);
        $("#opponent-health").text(opponentCharacter.health);
        var $results = $("#results");
        $results.empty();
        $results.append(`<p class="text-center attack-info"> ${playerCharacter.name} lost ${opponentCharacter.attackPower} health points</p>`);
        $results.append(`<p class="text-center attack-info">${opponentCharacter.name} lost ${playerCharacter.attackPower} health points</p>`);
        checkIfWin();
      }
    }
    
    const checkIfWin = () => {
      if ( playerCharacter.health <= 0 ) {
        console.log('you are losing')
        if ( opponentCharacter.health <=0) {
          console.log('tie');
          endGame(-1);
        } else {
          console.log('you lost completely');
          endGame(0);
        }
      } else if ( opponentCharacter.health <= 0) {
        console.log('numBattles is ' + numBattles);
        if (numBattles === maxBattles) {
          endGame(1);
        } else {
          numBattles++;
          winRound();
        }
      }
    }
    
    const winRound = () => {
      // hide the attack button
      var $visibleButton = $("#btn-attack").attr("class").replace("visible","invisible");
      $("#btn-attack").attr("class", $visibleButton);
      $("#disp-msg").html(`<p>You Won the round </p><p>Pick opponent #${numBattles}</p>`);
      opponentCharacter = null;
      // pick new character
      $("#player-box").css('pointer-events', 'auto'); // enable
    }
    
    const endGame = (status) => {
      switch (status) {
        case -1: // both dead
        console.log('both dead');
          $("#disp-msg").html("<p>Game over</p><p>A tragedy has occurred. You are both dead!</p>");
          break;
        case 0:  // lose game
        console.log('you lost')
          $("#disp-msg").html("<p>Game over</p><p>You lost!</p>");
          break;
        case 1:  // won game
        console.log('you won');
          $("#disp-msg").html(`<p>Game over</p><p>Congratulations! You beat all ${maxBattles} opponents!</p>`);
          break;
        default:
          console.log('Error in endGame');
      }
      playerCharacter = null;
      opponentCharacter = null;
      $("#btn-attack").text("Play Again");
    }  
    
      const clearAllRegions = () => {
        $("#player-name").empty();
        $("#player-picture").empty();
        $("#player-health").empty();
        $("#opponent-name").empty();
        $("#opponent-picture").empty();
        $("#opponent-health").empty();
        $("#results").empty();
      }

    // ===== character click ===================
    // Use the last character(s) of id name to get the index to use for 
    // the players array.  All id names begin with 'player-'
    $("#player-box").on("click", function(e) {  
      var index = e.target.id.slice(7);      
      if (playerCharacter === null) {
        playerCharacter =  players[index];
        let sound = document.getElementById(`${playerCharacter.soundId}`);
        sound.play();
        
        $("#player-name").text(playerCharacter.name);
        $("#player-picture").html(`<img class="p2 player-image" src=${playerCharacter.image} >`);
        $("#player-health").text(playerCharacter.health);
        $(`#player-${index}`).remove();
        $("#disp-msg").text(`select opponent #${numBattles}`);

  } else if (opponentCharacter === null) {
    opponentCharacter = players[index];
    let sound = document.getElementById(`${opponentCharacter.soundId}`);
    sound.play();
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
  const startPlaying = () => {
    resetScores();
    initializePlayers();
    createPlayers();
    runGame();
  }

  startPlaying();
  console.log(players);

})


// THE FOLLOWING LINES WILL DISABLE/ENBLE THE CLICKABLE PLAYER-BOX
// $("#player-box").css('pointer-events', 'none'); // disable
// $("#player-box").css('pointer-events', 'auto'); // enable
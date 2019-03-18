
// ===== Variables =======================
var mario = new Audio("./assets/sounds/mario.wav");
var bowser = new Audio("./assets/sounds/bowser.wav");
var koopa = new Audio("./assets/sounds/koopa.wav");
var daisy = new Audio("./assets/sounds/daisy.wav");
var wario = new Audio("./assets/sounds/wario.wav");
var yoshi = new Audio("./assets/sounds/yoshi.wav");
var waluigi = new Audio("./assets/sounds/waluigi.wav");

var playerCharacter = null
var opponentCharacter = null
var gamesWon = 0
var gamesLost = 0
var maxJewels = 0
var maxBattles = 3
var numBattles = 1

// ====== Class ============================
class Player {
  constructor(name, image, audio) {
    this.name = name;
    this.image = image;
    this.health = 0;
    this.attackIncrease = 0;
    this.attackPower = 0;
    this.sound = () => audio.play()
  }
}

const players = [
  new Player('Mario', './assets/images/mario.png', mario),
  new Player('Koopa', './assets/images/koopa.png', koopa),
  new Player('Daisy', './assets/images/daisy.png', daisy),
  new Player('Bowser', './assets/images/bowser.png', bowser),
  new Player('Wario', './assets/images/wario.png', wario),
  // new Player('Waluigi', './assets/images/waluigi1.png', waluigi),
  new Player('Yoshi', './assets/images/yoshi.png', yoshi),
]

/**
 * Resets scores when game is restarted
 */
const resetScores = () => {
  gamesWon = 0
  gamesLost = 0
  maxJewels = 0
  maxBattles = 3
  numBattles = 1
}

/**
 * Returns a random number between (and including) the two limits.
 * @param {*} min 
 * @param {*} max 
 */
const getRandomNumber = (min, max) => {
  if (min > max) { [min, max] = [max, min]; // swap the values if min > max
  }
  var numberSpan = max - min + 1
  return Math.floor(Math.random() * numberSpan) + min
}

/**
 * Assign health, attackIncrease and attackPower values to each player
 */
const initializePlayers = () => {
  players.forEach((p) => {
    p.health = getRandomNumber(10, 20) * 10
    p.attackIncrease = getRandomNumber(3, 6)
    p.attackPower = getRandomNumber(10, 25)
  })
}

// =====  JQUERY Start --- the following line is the same as $(document).ready(function() {})
$(function () {
  $('#instructions').html(`
    <p class="instructions" >Each character has a random number of <b>health points</b>, <b>attack points</b> and <b>attack increase</b> points. When two players battle,
    they lower their opponents health points by their attack points value. The attack points of the character fighting for you
    then has his attack points incremented by their attack increase value. (The opponent's attack points value remains the same.)
    <br>Choose a character to fight for you. You must battle ${maxBattles} opponents to win the game.</p>`)

  // disable player clicks until start button is clicked
  $('#player-box').css('pointer-events', 'none') // disable

  // Function that starts the game running
  function runGame () {
    $('#player-box').css('pointer-events', 'auto') // enable
    $('#disp-msg').text('select your character')
  }

  // create a player inside a frame inside the player-box div
  const playerInFrame = (index) => {
    $('#player-box').append(`<div id="player-${index}" class="m-1 player-frame"></div>`)
    var $playerFrame = $(`#player-${index}`)
    $playerFrame.append(`<div class="text-center player-info">${players[index].name}</div>`)
    $playerFrame.append(`<img id="player-${index}" class="p-2 d-block mx-auto player-frame-image" src=${players[index].image} >`)
    $playerFrame.append(`<div class="text-center player-info">${players[index].health}</div>`)
  }

  /**
   * Creates clickable images and puts them in the Player selection box
   */
  const createPlayers = () => {
    var $playerArea = $('#player-box');
    $playerArea.empty()
    for (var i = 0; i < players.length; i++) {
      playerInFrame(i);
    }
  }

  // This is a battle between two characters.
  // Reduce health of opponent by players counterattack value.
  const attack = () => {
    var $results = $('#results')
    $results.empty()    // clear status area
    // attack opponent
    opponentCharacter.health -= playerCharacter.attackPower
    $('#opponent-health').text(opponentCharacter.health)
    $results.append(`<p class="text-center attack-info">${opponentCharacter.name} lost ${playerCharacter.attackPower} health points</p>`)
    checkIfWin()
    // opponent attacks back
    playerCharacter.attackPower += playerCharacter.attackIncrease
    playerCharacter.health -= opponentCharacter.attackPower
    $('#player-health').text(playerCharacter.health)
    $results.append(`<p class="text-center attack-info"> ${playerCharacter.name} lost ${opponentCharacter.attackPower} health points</p>`)
    checkIfWin()
  }

  const restart = () => {
    $('#button-box').empty()
    clearAllRegions()
    startPlaying()
  }

  // Check if game is over
  const checkIfWin = () => {
    if (playerCharacter.health <= 0) {
      endGame(0)
    } else if (opponentCharacter.health <= 0) {
      if (numBattles === maxBattles) {
        endGame(1)
      } else {
        numBattles++
        winRound()
      }
    }
  }

  // When Round is won - have player choose next character to battle
  const winRound = () => {
    // hide the attack button
    var $visibleButton = $('#btn-attack').attr('class').replace('visible', 'invisible')
    $('#btn-attack').attr('class', $visibleButton)
    $('#disp-msg').html(`<p>You Won the round </p><p>Pick opponent #${numBattles}</p>`)
    $('#results').empty();
    opponentCharacter = null
    // pick new character
    $('#player-box').css('pointer-events', 'auto') // enable
  }

  const endGame = (status) => {
    switch (status) {
      case 0: // lose game
        $('#disp-msg').html('<p>Game over</p><p>You lost!</p>')
        break
      case 1: // won game
        $('#disp-msg').html(`<p>Game over</p><p>Congratulations! You beat all ${maxBattles} opponents!</p>`)
        break
      default:
        console.log('Error in endGame')
    }
    $('#results').empty();
    // put restart button inside the button-box
    $('#button-box').empty()
    $('#button-box').append(`<button id="btn-restart" class="btn btn-success btn-lg d-block mx-auto visible btn-begin" >PLAY AGAIN</button>`)
    // assign restart function to the button
    $('#btn-restart').click(restart)
    playerCharacter = null
    opponentCharacter = null
  }

  const clearAllRegions = () => {
    $('#player-name').empty()
    $('#player-picture').empty()
    $('#player-health').empty()
    $('#opponent-name').empty()
    $('#opponent-picture').empty()
    $('#opponent-health').empty()
    $('#results').empty()
  }

  // ===== character click ===================
  // Use the last character(s) of id name to get the index to use for 
  // the players array.  All id names begin with 'player-'

  $('#player-box').on('click', function (e) {
    var index = e.target.id.slice(7)
    if (playerCharacter === null) {
      playerCharacter = players[index]
      // let sound = document.getElementById(`${playerCharacter.soundId}`)
      playerCharacter.sound();

      $('#player-name').text(playerCharacter.name)
      $('#player-picture').html(`<img class="p2 player-image" src=${playerCharacter.image} >`)
      $('#player-health').text(playerCharacter.health)
      $(`#player-${index}`).remove()
      $('#disp-msg').text(`select opponent #${numBattles}`)
    } else if (opponentCharacter === null) {
      opponentCharacter = players[index]
      // let sound = document.getElementById(`${opponentCharacter.soundId}`)
      opponentCharacter.sound();
      $('#opponent-name').text(opponentCharacter.name)
      $('#opponent-picture').html(`<img class="p2 player-image" src=${opponentCharacter.image} >`)
      $('#opponent-health').text(opponentCharacter.health)

      $(`#player-${index}`).remove()
      $('#disp-msg').text('Time to battle!')
      // put attack button inside the button-box
      $('#button-box').empty()
      $('#button-box').append(`<button id="btn-attack" class="btn btn-primary btn-lg d-block mx-auto visible btn-begin" >ATTACK</button>`)
      // assign attack function to the button
      $('#btn-attack').click(attack)
    }

    // If both players have been chosen, disable the remaining characters
    if (playerCharacter != null && opponentCharacter != null) {
      $('#player-box').css('pointer-events', 'none') // disable
    }
  })

  // ===== BEGIN GAME ====================
  const startPlaying = () => {
    resetScores()
    initializePlayers()
    createPlayers()
    runGame()
  }
  startPlaying()
})

//design related variables
let main
let body
let homeScreen
let banner
let headerBanner
let footer
let scoreBoard
let resultDisplay
let startButton

//gameplay variables
let gameInPlay = true
let charDirection = 'right'
let currentStep = 0
let checkLoseInterval
let intervalWin = false
let audioFile
let ghosts
let score = 0

//initilize variables for each arrow key
const leftKey = 37
const upKey = 38
const rightKey = 39
const downKey = 40

//the player has won if there are no small dots remaining
function checkWin() {
  intervalWin = true
  for (let i = 0; i < width*width; i++) {
    if (squares[i].classList.contains('dots')) {
      intervalWin = false
    }
  }
  if (intervalWin) {
    resultDisplay.innerText = 'You win!'
    gameInPlay = false
  }
}

//function to check if Pacman and a ghost crosspaths, if so end the game
function collisionCheck() {
  ghosts.forEach(ghost => {
    if(squares[ghost.index].classList.contains('pacman') && ghost.className !== 'dead') {
      if(!ghost.isBlue) {
        deadPlayer()
      } else {
        deadGhost(ghost)
      }
    }
  })
}

function deadPlayer() {
  clearInterval(checkLoseInterval)
  gameInPlay = false
  resultDisplay.innerText = 'Sorry, you lose'
}

function deadGhost(ghost) {
  ghost.className = 'dead'
  clearInterval(ghost.intervalId)
  clearInterval(ghost.blueInterval)
  squares[ghost.index].classList.remove('blue')
  score+=200
  //reset ghosts after 5 seconds
  setTimeout(() => ghost.resetGhost(), 5000)
}

function blueGhostInterval() {
  ghosts.forEach(ghost => {
    prepBlueInterval(ghost)
    //turn the ghosts blue for ten seconds
    ghost.blueInterval = setInterval(() => {
      blueCountCheck(ghost)
    }, 1000)
  })
}

//clear the previous interval if it exists, and turn ghosts blue
function prepBlueInterval(ghost) {
  ghost.blueCount = 0
  clearInterval(ghost.blueInterval)
  setTimeout(() => {
    ghost.isBlue = true
  }, 100)
}

function blueCountCheck(ghost) {
  ghost.blueCount++
  if(ghost.blueCount === 10) {
    clearInterval(ghost.blueInterval)
    ghost.isBlue = false
  }
}

function startGame() {
  homeScreen.style.zIndex = '-1'
  startButton.style.zIndex = '-1'
  banner.style.zIndex = '-1'
  headerBanner.style.zIndex = '-1'

  new Pacman('pacman', 'player', width + 1)

  ghosts = [
    new Ghost('pink', 'ghost', 105),
    new Ghost('green', 'ghost', 36),
    new Ghost('orange', 'ghost', 325),
    new Ghost('red', 'ghost', 274)
  ]

  //set an interval on a small increment, calling the collisionCheck function
  checkLoseInterval = setInterval(collisionCheck, 5)
  checkWinInterval = setInterval(checkWin, 1000)

  //start Madonna - Into the Groove
  audioFile.play()
}


//function for creating the DOM content
function init() {
  body = document.querySelector('body')

  homeScreen = document.createElement('div')
  homeScreen.classList.add('home-screen')
  body.appendChild(homeScreen)

  startButton = document.createElement('div')
  startButton.classList.add('start-button')
  body.appendChild(startButton)
  startButton.innerText = 'Start Game'

  banner = document.createElement('div')
  banner.classList.add('banner')
  body.appendChild(banner)
  banner.innerText = 'A Night out in Malibu!'

  headerBanner = document.createElement('div')
  headerBanner.classList.add('headerBanner')
  body.appendChild(headerBanner)

  startButton.addEventListener('click', startGame)

  board = document.createElement('div')
  board.classList.add('board', 'bg-image')
  body.appendChild(board)

  footer = document.createElement('footer')
  main = document.querySelector('html')
  main.appendChild(footer)

  scoreBoard = document.createElement('div')
  scoreBoard.classList.add('score-details')
  footer.appendChild(scoreBoard)

  resultDisplay = document.createElement('div')
  resultDisplay.classList.add('game-details')
  footer.appendChild(resultDisplay)

  audioFile = document.createElement('audio')
  audioFile.src = 'music/Madonna-IntotheGroove.mp3'
  footer.appendChild(audioFile)

  scoreBoard.innerText = 'Score: 0'
  resultDisplay.innerText = 'Good luck!'

  createBoard()
}


document.addEventListener('DOMContentLoaded', init)

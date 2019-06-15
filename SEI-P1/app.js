//variables for the board
const width = 20
let main
let body
let board
let homeScreen
let banner
let headerBanner
let footer
let scoreBoard
let resultDisplay
let startButton
const squares = []
const walls = [
  42, 44, 45, 46, 48, 49, 50, 51, 53, 54, 55, 57,
  82, 84, 85, 86, 87, 89, 90, 92, 93, 94, 95, 97,
  102, 104, 115, 117, 122, 124, 126, 127, 128, 129,
  130, 131, 132, 133, 135, 137, 142, 144, 155, 157,
  162, 166, 168, 171, 173, 177, 182, 183, 185, 186,
  188, 191, 193, 194, 196, 197, 205, 206, 213, 214,
  221, 223, 225, 226, 228, 229, 230, 231, 233, 234,
  236, 238, 241, 243, 249, 250, 256, 258, 266, 267,
  269, 270, 272, 273, 282, 283, 284, 286, 287, 292,
  293, 295, 296, 297, 302, 303, 304, 306, 307, 309,
  310, 312, 313, 315, 316, 317, 326, 327, 329, 330,
  332, 333, 342, 343, 344, 349, 350, 355, 356, 357,
  366, 367, 372, 373
]

//variables for stopping/starting the game
let gameInPlay = true
let charDirection = 'right'
let currentStep = 0
let checkLoseInterval

// let checkWinInterval
let intervalWin = false
let audioFile
let ghosts

//variables for scores
let score = 0
const bigDots = [63, 78, 149, 215, 301, 369, 378]
const fruit = [30, 184, 217, 251, 361]

//initilize variables for each arrow key
const leftKey = 37
const upKey = 38
const rightKey = 39
const downKey = 40


function createBoard() {
  //generate walls along the perimeter and fill the interior with dots
  for(let i = 0; i < width ** 2; i++) {
    const square = document.createElement('div')
    if(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width) {
      square.classList.add('wall')
    }
    board.appendChild(square)
    squares.push(square)
    if(!(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width)) {
      square.classList.add('dots')
    }
  }
  //add the big dots
  for (let i = 0; i < bigDots.length; i++) {
    squares[bigDots[i]].classList.add('big-dots')
    squares[bigDots[i]].classList.remove('dots')
  }
  //add the maze walls
  for (let i = 0; i < walls.length; i++) {
    squares[walls[i]].classList.add('wall')
    squares[walls[i]].classList.remove('dots')
    squares[walls[i]].classList.remove('big-dots')
  }
  //add the fruit
  for (let i = 0; i < fruit.length; i++) {
    squares[fruit[i]].classList.add('fruit')
    squares[walls[i]].classList.remove('dots')
  }
}

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


function init() {
  //refactored function creating the board
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

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


class Character {
  constructor(className, classType, index) {
    this.className = className
    this.classType = classType
    this.index = index

    this.render()
  }

  render() {
    squares[this.index].classList.add(this.className, this.classType)
  }

  move() {
    clearInterval(this.intervalId)
    if(!gameInPlay) return false

    this.intervalId = setInterval(() => {
      this.intervalCheck()
    }, 200)
  }

  intervalCheck() {
    if(!this.moveIsValid()) {
      this.stopMove()
      return false
    }

    this.updateClass()
    this.moveStyle()
    this.eat()
    this.turnGhostsBlue()
  }

  updateClass() {
    squares[this.index].classList.remove(this.className, this.classType)
    this.previousIndex = this.index
    this.index += this.direction
    squares[this.index].classList.add(this.className, this.classType)
  }

  stopMove() {
    clearInterval(this.intervalId)
  }

  //functions below are character dependent, defined in relevant subclass
  moveStyle() {}          //applies only to pacman
  eat() {}                //applies only to pacman
  turnGhostsBlue() {}     //applies only to ghosts
  resetGhost() {}         //applies only to ghosts
  moveIsValid() {}        //applies only to ghosts
  moveIsSmart() {}        //applies only to ghosts
}

class Pacman extends Character {
  constructor(className, classType, index) {
    super(className, classType, index)
    this.addEventListeners()
  }

  addEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch(e.keyCode) {
        case leftKey: this.direction = -1
          charDirection = 'left'
          break
        case upKey: this.direction = -width
          charDirection = 'up'
          break
        case rightKey: this.direction = +1
          charDirection = 'right'
          break
        case downKey: this.direction = +width
          charDirection = 'down'
          break
      }
      this.move()
    })
  }

  moveStyle() {
    currentStep = currentStep === 3 ? 0 : currentStep + 1
    squares[this.index].setAttribute('data-step', currentStep)
    squares[this.index].setAttribute('data-direction', charDirection)
  }

  moveIsValid() {
    if (squares[this.index + this.direction].classList.contains('wall')) {
      return false
    } else {
      return true
    }
  }

  eat() {
    const spaceClasses = squares[this.index].classList
    //+1 point for eating a dot
    if(spaceClasses.contains('dots')) {
      spaceClasses.remove('dots')
      score++
    }
    //+50 points for eating fruit
    if(spaceClasses.contains('fruit')) {
      spaceClasses.remove('fruit')
      score+=50
    }
    //+100 points for big dots and trigger the blue ghost interval
    if(spaceClasses.contains('big-dots')) {
      spaceClasses.remove('big-dots')
      score += 100
      blueGhostInterval()
    }
    scoreBoard.innerText = 'Score: ' + score
  }
}


class Ghost extends Character {
  constructor(className, classType, index) {
    super(className, classType, index)

    this.originalClass = className
    this.previousIndex = this.index
    this.options = [width, 1, -width, -1]
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]

    this.blueInterval = 0
    this.blueCount = 0
    this.isBlue = false

    this.move()
  }

  //check the move is valid and reassign the direction to follow pacman
  moveIsValid() {
    let possibleMoves = []
    let smartMoves = []

    if(squares[this.index + this.direction].classList.contains('wall')) {
      return false
    } else {
      possibleMoves = this.options.filter(option => this.possMoves(option))
      smartMoves = possibleMoves.filter(move => this.moveIsCloser(move))
      this.assignDirection(smartMoves)
      return true
    }
  }

  //filter out previous direction and moves where there is a wall
  possMoves(option) {
    return !squares[this.index + option].classList.contains('wall') && this.index + option !== this.previousIndex
  }

  //check if the move is further away or closer to pacman
  moveIsCloser(option) {
    const pacmanIndex = squares.findIndex(cell => cell.classList.contains('player'))
    //if the ghosts are not blue, move closer to pacman
    if(!this.isBlue && Math.abs((this.index + option) - pacmanIndex) < (Math.abs(this.index - pacmanIndex))) {
      return true
    //if the ghosts are blue, move further away from pacman
    } else if (this.isBlue && Math.abs((this.index + option) - pacmanIndex) > (Math.abs(this.index - pacmanIndex))){
      return true
    } else {
      return false
    }
  }

  //if two potential moves are closer, pick one at random rather than the quickest
  //'else' - do nothing, no possible closer move, no change to this.direction
  assignDirection(moves){
    if(moves.length === 1) {
      this.direction = moves[0]
    } else if (moves.length === 2) {
      this.direction = moves[Math.floor(Math.random() * moves.length)]
    }
  }

  stopMove() {
    clearInterval(this.intervalId)
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()
  }

  turnGhostsBlue() {
    if(this.isBlue) {
      this.className = 'blue'
      squares.forEach(square => square.classList.remove(this.originalClass))
    } else {
      this.className = this.originalClass
      squares.forEach(square => square.classList.remove('blue'))
    }
  }

  //reset the ghosts className, index, and reactivate its ability to move
  resetGhost() {
    //reset the ghost isBlue option to being false
    this.isBlue = false
    this.className = this.originalClass
    //reset the ghost to the middle of the board
    this.index = (width * width)/2 - width/2
    this.options = [width, 1, -width, -1]
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()
  }
}

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

// function resetGame() {
//   score = 0
//   player = 0
//   ghosts = []
//   resultDisplay.innerText = ""
//
//   //replace the dots -
//
//   // for (let i = 0; i < bigDots.length; i++) {
//   //       squares[bigDots[i]].classList.add('big-dots')
//   //       squares[bigDots[i]].classList.remove('dots')
//   //     }
//   //
//   // for(let i = 0; i < width ** 2; i++) {
//   //   if(!(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width)) {
//   //     square.classList.remove('dots')
//   //   }
//   // }
//   //
//   // for(let i = 0; i < width ** 2; i++) {
//   //   if(!(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width)) {
//   //     square.classList.add('dots')
//   //   }
//   // }
//
//   player = new Pacman('pacman', 'player', width + 1)
//
//   ghosts = [
//     new Ghost('pink', 'ghost', 105),
//     new Ghost('green', 'ghost', 36),
//     new Ghost('orange', 'ghost', 325),
//     new Ghost('red', 'ghost', 274)
//   ]
//
//   //set an interval on a small increment, calling the collisionCheck function
//   checkLoseInterval = setInterval(collisionCheck, 5)
//
//
// }




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


  // resetButton = document.createElement('div')
  // resetButton.classList.add('reset')
  // footer.appendChild(resetButton)

  //resetButton.addEventListener('click', resetGame)

  scoreBoard.innerText = 'Score: 0'
  resultDisplay.innerText = 'Good luck!'
  //resetButton.innerText = "Reset"

  createBoard()
}


document.addEventListener('DOMContentLoaded', init)

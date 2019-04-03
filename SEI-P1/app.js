document.addEventListener('DOMContentLoaded', function() {
//variables related to the board
const width = 18
const board = document.querySelector('.board')
const squares = []
//variable for stopping/starting the game
let gameInPlay = true
let charDirection = 'right'
let currentStep = 0
//variables related to the blue ghosts behavior
//let ghostsBlue = false
//let blueCount = 0
let intervalBlue = 0
//variables for score dots and lives
let score = 0
let bigDots = [width * 4 + 5, width * 4 + 13, width * (width - 4) + 5, width * (width - 3) - 5, width + 2]
let livesCount = 3
//initilize variables for each arrow key
const leftKey = 37
const upKey = 38
const rightKey = 39
const downKey = 40


//refactored function creating the board
function createBoard() {
  for(let i = 0; i < width ** 2; i++) {
    const square = document.createElement('DIV')
    if(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width) { square.classList.add('wall')
    }
    board.appendChild(square)
    squares.push(square)
    if(!(i < width || i % width === 0 || i % width === width - 1 || i > width * width - width)) {
      square.classList.add('dots')
    }
  }
  for (let i = 0; i < bigDots.length; i++) {
        squares[bigDots[i]].classList.add('big-dots')
        squares[bigDots[i]].classList.remove('dots')
      }
}

//function to check if Pacman and the ghosts crosspaths, if so end the game
//change to collision check
function collisionCheck() {
  ghosts.forEach(ghost => {
    if(squares[ghost.index].classList.contains('pacman') && ghost.className !== 'dead') {
      if(!ghost.isBlue) {
        //squares.forEach(index => squares[index].classList.remove('pacman'))
        clearInterval(checkLoseInterval)
        gameInPlay = false
        console.log('you lose')
      } else {
        // "if(ghost.isBlue)" - ghosts are blue, so pacman eats ghost
        ghost.className = 'dead'
        clearInterval(ghost.intervalId)
        clearInterval(ghost.blueInterval)
        squares[ghost.index].classList.remove('blue')
        score+=100

        console.log('blue ghost killed')

        //reset ghosts after 5 seconds
        setTimeout(() => {ghost.resetGhost()}, 5000)

      }
    }
  })
}

//this function sets the variable ghost.isBlue to true for 10 seconds
function blueGhostInterval() {

  ghosts.forEach(ghost => {
  //clear the previous interval if it exists
  ghost.blueCount = 0
  clearInterval(ghost.blueInterval)
  //turn the ghosts blue when the big dots are eaten, for ten seconds

  ghost.blueInterval = setInterval(() => {
    ghost.isBlue = true
    ghost.blueCount++
    if(ghost.blueCount === 10) {
      clearInterval(ghost.blueInterval)
      ghost.isBlue = false
      }
    }, 1000)
  })
}

//Base class for creating the characters, everything within this class is shared by pacman and the ghosts
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
      if(squares[this.index + this.direction].classList.contains('wall')) {
        this.stopMove()
        return false
      }
      squares[this.index].classList.remove(this.className, this.classType)

      this.index += this.direction
      squares[this.index].classList.add(this.className, this.classType)

      this.moveStyle()
      this.eatDots()
      this.turnGhostsBlue()


      }, 200)

  }

  stopMove() {
    clearInterval(this.intervalId)
  }

  //initialize empty functions for character dependent functions, functions defined in subclasses below
  moveStyle() {} //applies only to pacman
  eatDots() {} //applies only to pacman
  turnGhostsBlue() {} //applies only to ghosts
  resetGhost() {}  //applies only to ghosts

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

  eatDots() {
      //eat the little dots and increase the score by 1
      if(squares[this.index].classList.contains('dots')) {
        squares[this.index].classList.remove('dots')
        score++
        console.log(score)
      }
      //eat the big dots and increase the score by 50 set the ghost.isBlue to be true
      if(squares[this.index].classList.contains('big-dots')) {
        squares[this.index].classList.remove('big-dots')
        score += 50
        blueGhostInterval()
      }
    }
}

class Ghost extends Character {
  constructor(className, classType, index) {
    super(className, classType, index)

    this.originalClass = className

    //each ghost class needs its own blue interval property
    this.blueInterval = 0
    this.blueCount = 0
    this.isBlue = false
    this.options = [width, 1, -width, -1]
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()
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

    //reset the ghost class to being false
    this.isBlue = false

    this.className = this.originalClass

    //reset the ghost to the middle of the board
    this.index = (width * width)/2 - width/2
    this.options = [width, 1, -width, -1]
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()

  }


}



createBoard()

const player = new Pacman('pacman', 'player', width + 1)

const ghosts = [
  new Ghost('pink', 'ghost', 22),
  new Ghost('green', 'ghost', 88),
  new Ghost('orange', 'ghost', 132),
  new Ghost('red', 'ghost', 240)
]

//set an interval on a small increment, calling the collisionCheck function
let checkLoseInterval = setInterval(collisionCheck, 5)







})

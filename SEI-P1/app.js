document.addEventListener('DOMContentLoaded', function() {
//variables related to the board
const width = 20
const board = document.querySelector('.board')
const squares = []
const walls = [42, 44, 45, 46, 48, 49, 50, 51, 53, 54, 55, 57, 82, 84, 85, 86, 87, 89, 90, 92, 93, 94, 95, 97, 102, 104, 115, 117, 122, 124, 126, 127, 128, 129, 130, 131, 132, 133, 135, 137, 142, 144, 155, 157, 162, 166, 168, 171, 173, 177, 182, 183, 185, 186, 188, 191, 193, 194, 196, 197, 205, 206, 213, 214, 221, 223, 225, 226, 228, 229, 230, 231, 233, 234, 236, 238, 241, 243, 249, 250, 256, 258, 266, 267, 269, 270, 272, 273, 282, 283, 284, 286, 287, 292, 293, 295, 296, 297, 302, 303, 304, 306, 307, 309, 310, 312, 313, 315, 316, 317, 326, 327, 329, 330, 332, 333, 342, 343, 344, 349, 350, 355, 356, 357, 366, 367, 372, 373]
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
let bigDots = [63, 78, 149, 215, 301, 369, 378]
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
  for (let i = 0; i < walls.length; i++) {
    squares[walls[i]].classList.add('wall')
    squares[walls[i]].classList.remove('dots')
    squares[walls[i]].classList.remove('big-dots')
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

    this.moveValid = true

    this.render()
  }

  render() {
    squares[this.index].classList.add(this.className, this.classType)
  }

  move() {
    clearInterval(this.intervalId)
    if(!gameInPlay) return false

    this.intervalId = setInterval(() => {

      this.moveIsValid()
      //if(!this.moveValid) replace the conditional below
      //if(squares[this.index + this.direction].classList.contains('wall')) {
      if(!this.moveValid) {
        this.stopMove()

        //does this need to be in here as well? think so...
        //this.smartGhostDirection()

        return false
      }

      squares[this.index].classList.remove(this.className, this.classType)

      this.index += this.direction
      squares[this.index].classList.add(this.className, this.classType)

      this.moveStyle()
      this.eatDots()
      this.turnGhostsBlue()

      //this.moveIsValid() // check walls for pacman, check walls ghost previousIndex for ghosts
      //this.smartGhostDirection()

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
  //smartGhostDirection() {} //applies only to ghosts - does this need to come before stopMove? think so
  moveIsValid() {} // only applies to the ghosts

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

  moveIsValid() {
    if (squares[this.index + this.direction].classList.contains('wall')) {
        this.moveValid = false
    } else this.moveValid = true
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

    //store the current index before moving so it can be used to prevent the ghosts from moving back on themselves
    this.previousIndex = this.index


    this.move()
  }

  //function for picking which direction for the ghosts to move in
  //what do I need to pass in? - previous index?
  // will need the previous index, the new index, and pacmans position (player.index?)

  moveIsValid() {
    // start with generating this.direction with Math.random as before, then check the below:
    // 1. is this.index += this.direction !== previousIndex? - must be TRUE
    // 2. does squares[this.index += this.direction].classList.contains('wall')? - must be FALSE
    // 3. does squares[this.index += this.direction].classList.contains('ghost')? - must be FALSE

    if (squares[this.index + this.direction].classList.contains('wall') || squares[this.index + this.direction].classList.contains('ghost')) {
        this.moveValid = false
    } else this.moveValid = true


  }

  //break up the below into two functions - move is valid to check the first three criteria
  // and moveIsSmart to check if it is further away or not

  smartGhostDirection() {

    // this function should reassign this.direction before it is passed into move(), maybe use a while loop that ends until all the criteria are met, then calls the move function
    // start with generating this.direction with Math.random as before, then check the below:
    // 1. is this.index += this.direction !== previousIndex? - must be TRUE
    // 2. does squares[this.index += this.direction].classList.contains('wall')? - must be FALSE
    // 3. does squares[this.index += this.direction].classList.contains('ghost')? - must be FALSE
    // 4. does it pass if (Math.abs(this.index - newPos) > Math.abs(this.index - newPos))? preferably TRUE but if there are no other options this can be FALSE.

    //how to check if there are any other options? for loop filtering options?

  }




  stopMove() {
    clearInterval(this.intervalId)

    //this might need to be taken out, as the new direction will be generated by smartGhostDirection
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]

    //function invoked here will reassign this.direction

    //store the previousIndex
    this.previousIndex = this.index


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



createBoard()

const player = new Pacman('pacman', 'player', width + 1)

const ghosts = [
  new Ghost('pink', 'ghost', 105),
  new Ghost('green', 'ghost', 36),
  new Ghost('orange', 'ghost', 325),
  new Ghost('red', 'ghost', 274)
]

//set an interval on a small increment, calling the collisionCheck function
let checkLoseInterval = setInterval(collisionCheck, 5)







})

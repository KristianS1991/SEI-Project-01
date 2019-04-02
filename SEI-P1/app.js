document.addEventListener('DOMContentLoaded', function() {

const width = 18
const board = document.querySelector('.board')
const squares = []
let gameInPlay = true
let charDirection = 'right'
let currentStep = 0
let ghostsBlue = false
let score = 0
let bigDots = [width * 4 + 5, width * 4 + 13, width * (width - 4) + 5, width * (width - 3) - 5, width + 2]

//initilize variables for each arrow key
const leftKey = 37
const upKey = 38
const rightKey = 39
const downKey = 40



// make the grid
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

// add the dynamic styling for the direction and step in which pacman and the ghosts move
// function moveStyle(index) {
//   currentStep = currentStep === 3 ? 0 : currentStep + 1
//   squares[index].setAttribute('data-step', currentStep)
//   squares[index].setAttribute('data-direction', charDirection)
// }

//function to eat the dots and ghosts (if blue) and increase the score
// function eatDotsAndGhosts(index,intervalId) {
//   //eat the little dots and increase the score by 1
//   if(squares[index].classList.contains('pacman') && squares[index].classList.contains('dots')) {
//     squares[index].classList.remove('dots')
//     score++
//     console.log(score)
//   }
//
//   if(squares[index].classList.contains('pacman') && squares[index].classList.contains('big-dots')) {
//     squares[index].classList.remove('big-dots')
//     score += 50
//     console.log(score)
//   }
//
//   if(squares[index].classList.contains('pacman') && squares[index].classList.contains('ghost')) {
//     squares[index].classList.remove('pacman')
//     clearInterval(intervalId)
//
//     console.log('pacman is dead')
//   }
// }

// function ghostEatsPacman(index, intervalId) {
//   if(squares[index].classList.contains('pacman') && squares[index].classList.contains('ghost') {
//
//
//
//   }
// }


function consoleTrial(index, direction) {
  console.log(index, direction)
}

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
      this.eatDotsAndGhosts()

      // if(this.className === 'pacman') {
      //     moveStyle(this.index)
      //     //eatDotsAndGhosts(this.index,this.intervalId)
      //   }

      // } else if (this.className === 'ghost') {
      //   ghostEatsPacman(this.index, player.intervalId)
      // }



      }, 200)

  }

  stopMove() {
    clearInterval(this.intervalId)
  }

  moveStyle() {}
  eatDotsAndGhosts() {}


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

      // moveStyle() {
      //   currentStep = currentStep === 3 ? 0 : currentStep + 1
      //   squares[this.index].setAttribute('data-step', currentStep)
      //   squares[this.index].setAttribute('data-direction', charDirection)
      // }

      this.move()
    })

  }

  moveStyle() {
    currentStep = currentStep === 3 ? 0 : currentStep + 1
    squares[this.index].setAttribute('data-step', currentStep)
    squares[this.index].setAttribute('data-direction', charDirection)
  }

  eatDotsAndGhosts() {
      //eat the little dots and increase the score by 1
      if(squares[this.index].classList.contains('dots')) {
        squares[this.index].classList.remove('dots')
        score++
        console.log(score)
      }
      //eat the big dots and increase the score by 50
      if(squares[this.index].classList.contains('big-dots')) {
        squares[this.index].classList.remove('big-dots')
        score += 50
        console.log(score)
      }

      //might want to do this outside as a global intervalcheck, at a lower interval, the below only kindof works
      if(squares[this.index].classList.contains('ghost')) {
        squares[this.index].classList.remove('pacman')
        clearInterval(this.intervalId)
        console.log('pacman is dead')
        gameInPlay = false
      }


    }


}

class Ghost extends Character {
  constructor(className, classType, index) {
    super(className, classType, index)

    this.options = [width, 1, -width, -1]
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()
  }

  stopMove() {
    clearInterval(this.intervalId)
    this.direction = this.options[Math.floor(Math.random() * this.options.length)]
    this.move()

  }



}


const player = new Pacman('pacman', 'player', width + 1)

const ghosts = [
  new Ghost('pink', 'ghost', 22),
  new Ghost('green', 'ghost', 88),
  new Ghost('orange', 'ghost', 132),
  new Ghost('red', 'ghost', 240)
]








})

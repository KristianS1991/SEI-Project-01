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

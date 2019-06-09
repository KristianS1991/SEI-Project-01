class Character {
  constructor(className, classType, index, squares) {
    this.squares = squares
    this.className = className
    this.classType = classType
    this.index = index
    this.moveValid = true

    this.render()
  }

  render() {
    this.squares[this.index].classList.add(this.className, this.classType)
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
    this.squares[this.index].classList.remove(this.className, this.classType)
    this.previousIndex = this.index
    this.index += this.direction
    this.squares[this.index].classList.add(this.className, this.classType)
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

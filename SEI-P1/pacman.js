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

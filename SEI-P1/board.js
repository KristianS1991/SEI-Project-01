//variables for the board
let board
const width = 20
const squares = []
const fruit = [30, 184, 217, 251, 361]
const bigDots = [63, 78, 149, 215, 301, 369, 378]
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

# SEI-Project-1 - Front-End Game with JavaScript


## Timeframe
7 days

## Technologies Used
* JavaScript (ES6)
* HTML5
* CSS
* GitHub

## Installation
1. Clone or download the repository.
2. Open the `index.html` page in the browser of your choice.

## The Game - Ms Pac-Man, A Night Out in Malibu

![Ms PacMan Banner](https://i.imgur.com/PtNL3yw.png)

### Game Overview
*Ms Pac-Man, A Night Out in Malibu* is a rendition of the classic arcade game *Ms Pac-Man*,
that I created using JavaScript, HTML, and CSS. The aim of the game is to clear the nightclub of all the dots and disco balls while avoiding getting eaten by the ghosts. The ghosts are constantly in pursuit of Ms Pac-Man until she eats a disco ball, which then turns the ghosts blue for a short period of time and allows Ms Pac-Man to eat them. The ghosts will regenerate in the centre of the board briefly after being eaten by Ms Pac-Man. If Ms Pac-Man touches a ghost while they are not blue, the game is over.

### Controls
* Move Ms Pac-Man:  ←  ↑  →  ↓  keys

## Creating the Board
The starting point for this game was creating a grid on which to build a maze that the characters would navigate. I decided on a board with dimensions of 20 x 20, so a total of 400 square shaped divs. Building the board consisted of looping over multiple arrays and assigning a class of 'wall', 'dots', 'big-dots', or 'fruit', depending on each index's purpose.

## Creating the Characters
At first, I built the characters using only functions to describe how they moved and responded to collisions. The game was functional, however, I noticed I was repeating a lot of code and it was proving difficult to add new characters. After some research online, I learned that I could take a more scalable approach by implementing classes to describe the characters behaviour. I created three different classes to make up the functionality of the characters:
1. A **Character** base class
2. A **Pacman** subclass of the **Character** base class
3. A **Ghost** subclass of the **Character** base class

### Character Base Class
The character base class contains all the functionality that Ms Pac-Man and the ghosts have in common, ie. general movement. The characters are all moving on set intervals. When the interval is triggered, the character moves in that direction until the next move is invalid.


### Pacman Subclass
The Pacman class is a subclass of the Character class. It contains all the functionality that differentiates Ms PacMan's behaviour from the ghosts behaviour. The main distinction being that Ms Pac-Man is controlled by the user. Therefore, I added event listeners to the arrow keys to control the movement. Each arrow key triggers a new interval in that direction and clears the previous interval. Ms Pac-Man is also the only character who eats things off the board and accumulates points. I have included a function to account for each case of eating an item, adjusting the score accordingly.


### Ghost Subclass
#### Default Ghost Behaviour
The Ghost class is a subclass of the Character class. This class describes the automated behaviour
for all the ghosts on the board. An interval is set to start moving the ghosts as soon as they have rendered. This process begins by selecting a direction at random (up, down, left, or right) and then passing that direction through a series of functions to determine whether or not that move is intelligent or the only possible move. If that direction is found to not be the best move or the only option, that direction is filtered out of the array of options and a new direction is selected from the array until the criteria have been satisfied. That direction is then reassigned as the new direction for the ghost to move in, and a new interval in that direction is set and only cleared once the ghost runs into a wall. The below list summarizes the criteria that the ghost's new move must meet:
1. There must not be a wall in that space.
2. The ghosts cannot go back to a previous index.
3. The move must be closer to Ms Pac-Man. (further if the ghosts are blue)
          OR
4. There are no possible moves to get closer to Ms Pac-Man.

Criteria 1 and 2 must always be satisfied, and either criteria 3 or criteria 4 must be met for the move to be executed. Due to the configuration of the maze, there is not always an option for the the ghost to get closer to Ms. Pac-Man. In this case, the ghost must move in that direction until the interval is cleared (the ghost hits a wall) and a new direction is selected.

![Ghosts Chasing](https://i.imgur.com/SUzJBaM.gif)

#### Blue Ghost Behaviour
If Ms. Pac-Man eats a disco ball, an interval is triggered where all the ghosts turn blue for ten seconds. If the ghosts are blue, again criteria 1 and 2 still must be satisfied. However, criteria 3 and 4 become the opposite, as the ghosts are now trying to flee from Ms. Pac-Man. If Ms. Pac-Man eats a blue ghost, the ghost disappears and the reset ghost function is invoked, which will reset a default ghost after five seconds in the middle of the board.

![Ghosts Fleeing](https://i.imgur.com/IwzMYaE.gif)

## Checking for a Win or Loss
There are two intervals running during the game that are checking on the game's status. One interval runs every second to check if there are any dots remaining on the board, and returning a boolean based on if this is true or false to determine if the user has won the game. The other interval runs every five milliseconds to check for collisions between Ms.Pac-Man and the ghost. In the code, this is represented by checking each of the ghosts indices on the grid for a class of 'pacman', then passing through a conditional to see if the ghost is blue or not. If the ghost is blue, the ghost is killed and reset, and the score is updated. If the ghost is not blue, the user has lost the game and all the intervals on the board are cleared and the game is over.

## Challenges
The biggest challenge of this project had to be writing the functionality to make the ghosts follow (or flee) Ms. Pac-Man. Pseudo-coding the logic seemed straight-forward: find Ms. Pac-Man's current index, check whether the new index of the ghost is closer or not, then assign or eliminate this option, looping through the array of options until the best move was found. Actually putting this into practice proved to be another story.

The logic would seemingly have to be a part of the Ghost subclass, as it is unique to the ghost characters. However, the general move functionality was shared by all characters and therefore a part of the base Character class, so at first it was difficult to see where the actual logic would be implemented. I realized that the function for checking if the move is valid (moveIsValid), was invoked in the base class, but written differently in each subclass. Therefore, I could write the logic to check that the move followed Ms. Pac-Man within the Ghost subclass "moveIsValid" function.

Having determined where this logic would go, the next step was to write it. This turned out to be an iterative trial-and-error process, implementing a series of filters to narrow down all the options into an array of possible moves, and then an array of smart moves, if they existed. Once a filtered array of one or two moves that could get the ghost closer to Ms. Pac-Man was established, either the one move, or one of the two moves chosen at random, was then reassigned as the ghost's new direction. If there were no smart moves, (the 'else' case), the function was to do nothing and the original move was kept as the new direction.

## Separation Of Concerns
Initially, I wrote all of the functionality for this project in a single `app.js` file. As this file got longer and longer, I figured that for better organization and to follow best practices, I should split the code into separate files based on the purpose of each section of code. I decided to have a main `app.js` file to contain all the code for creating the DOM content in the `index.html` file, run the functions that regulate the rules of the game (ie. checking for wins and losses), and create the characters upon the start of the game. I made a separate file, board.js, that held the function for creating the game board. I also added three separate files that contained the character, pacman, and ghost classes. Then, I added a new `<script>` tag to the body of the `index.html` for each script, in an order ensuring any dependencies were loaded first.

## Future Add-ons
There were two main extra features I would have liked to add to this project. Due to timing constraints, I did not get the opportunity to add these features. The first feature I would like to add to this project is a reset button. I would add an event listener to this button, so that upon clicking, the board would re-render with all of the original items and characters, and reset the score. Another feature I would like to add would be a difficulty setting for the user to select. This would change the logic applied to the ghosts following Ms. Pac-Man. The 'easy' setting would be the original logic I have in place now, where if there are two moves the ghosts can make to get closer to Ms. Pac-Man, the move is selected at random. In this case, the ghosts aren't always taking the fastest route possible, making it a bit easier for the user. In the 'hard' setting, the logic would slightly change. If there were two possible closer moves the ghosts can make, it would compare the two moves and select the one that gets the ghost even closer. This would increase the ghosts chasing efficiency and make it more difficult for the user. An alternative, simpler, method for difficulty settings would be to shorten the interval that the ghosts move on, increasing or decreasing their speed accordingly.

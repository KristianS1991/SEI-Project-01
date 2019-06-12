#SEI-Project-1 - Front-end Game with JavaScript

##Timeframe
7 days

##Technologies Used
* JavaScript (ES6)
* HTML5
* CSS
* GitHub

##Installation
1. Clone or download the repository.
2. Open the index.html page in the browser of your choice.

##The Game - Ms Pac-Man, A Night Out in Malibu

###Game Overview
*Ms Pac-Man, A Night Out in Malibu* is a rendition of the classic arcade game *Ms Pac-Man*,
that I created using JavaScript, HTML, and CSS. The aim of the game is to clear the nightclub of all the dots and disco balls while avoiding getting eaten by the ghosts. The ghosts are constantly in pursuit of Ms Pac-Man until she eats a disco ball, which then turns the ghosts blue for a short period of time and allows Ms Pac-Man to eat them. The ghosts will regenerate in the center of the board briefly after being eaten by Ms Pac-Man. If Ms Pac-Man touches a ghost while they are not blue, the game is over.

###Controls
* Move Ms Pac-Man: ← ↑ → ↓ keys

##Process
###Creating the Board
The starting point for this game was creating a grid on which to build a maze that the characters would navigate. I decided on a board with dimensions of 20 x 20, so a total of 400 square shaped divs. Building the board consisted of looping over multiple arrays and assigning a class of 'wall', 'dots', 'big-dots', or 'fruit', depending on each index's purpose.

###Creating the Characters
At first, I built the characters using only functions to describe how they moved and responded to collisions. The game was functional, however, I noticed I was repeating a lot of code and it was proving difficult to add new characters. After some research online, I learned that I could take a more scalable approach by implementing classes to describe the characters behaviour. I created three different classes to make up the functionality of the characters:
        1. A **Character** base class
        2. A **Pacman** subclass of the **Character** base class
        3. A **Ghost** subclass of the **Character** base class

####Character Base Class
The character base class contains all the functionality that Ms Pac-Man and the ghosts have in common, ie. general movement. The characters are all moving on set intervals. When the interval is triggered, the character moves in that direction until the next move is invalid.

####Pacman Class


####Ghost Class

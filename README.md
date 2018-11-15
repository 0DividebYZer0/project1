# Project1

## Team Members
* Angel Garcia 
* Bryant Gossett
* Kenneth Chung
* Marsha Leconte

## Project Description
The game is based on the idea of treasure hunt using the Google Map API.  The target audience for this game is anyone old enough to read and use a computer.  This is a one player  game where the location and the hidden object are provided by the game (computer). The user controls the game by using the mouse and clicking on the map with the goal of finding the hidden object. The hidden object is placed in a specific location/radius provided by the game.  The map presented to the user also provides a series of clues such as: “The object is hidden 5 miles from the Starbuck in Union Square”.  The user by clicking on the map is given more clues  as to being on the right track or not.  The player must find the object before a timer runs out. Once the timer is up the round is over and the user losses. If the location is found before the timer runs out the user wins. At the end of each round, the hidden object and location  is revealed to the user. The user is then given the option to start another round. At the end of five rounds the game is over. A score table provides the wins or loss of the user per round.

## Sketch of Final Project
![Image of App](./assets/images/app.png)
## APIs to be Used
* Google Maps
* Giphy

## Libraries
* Google Maps Drawing Layer

## Rough Breakdown of Tasks
* Game logic (flow) - Kenneth
This concerns the progression of the game through its various states. The app will recognize when the user logs in, initiate the game, handle the user's input (determine whether the user won or lost and respond accordingly), and proceed to subsequent rounds. Developing the game involves working with variables that will be used by the other components of the app (e.g. recording a win updates a display on the front end and a property value in Firebase). 


* Front end (UI) - Bryant
This concerns the layout, styling, and interactivity of the Web page. The page will feature an interactive map for the user to hover over/click. The app will also accept textual input (e.g. the user's login information), display game data (e.g. wins/losses, previous rounds' outcomes and locations), and feature message sections that update to reflect the state of the game (e.g. "ready to play", "time's up!"). 


* API handling - Marsha
We will enlist the Google Maps API's capability to calculate distances between points on a map and query its information about landmarks. Using the API will entail recording user guesses and calculating the distance from the guessed point to the hidden location. We will also use landmark data to provide clues for the user (identifying landmarks that are within a given distance from the hidden location). 


* Firebase handling - Angel
The Firebase realtime database will track user logins (connections), maintain data about the users (name, wins, losses), and store records of previously-played games. We are still contemplating the persistence lifetimes of these data; for example, wins/losses should persist at least through the session, but we could configure the app to remember users across sessions, allowing them to sign in and continue building their win/loss totals. 

# Project Requirements
* Must use at least two APIs
* Must use AJAX to pull data
* Must utilize at least one new library or technology that we haven’t discussed
* Must have a polished frontend / UI 
* Must meet good quality coding standards (indentation, scoping, naming)
* Must NOT use alerts, confirms, or prompts (look into modals!)
* Must have some sort of repeating element (table, columns, etc)
* Must use Bootstrap or Alternative CSS Framework
* Must be Deployed (Github Pages)
* Must have User Input Validation 
* Utilize Firebase for Persistent Data Storage.




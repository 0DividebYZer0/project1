var roundNumber = 0;
var remainingLocations = [];
var currentLocation = [];
var numberOfLocations=0

var database = firebase.database();

var locations = database.ref("/locations");
var gameStats = {};
var displayName = "";
var uid = "";
var userLoggedIn = false

// acceptClick: this Boolean variable helps control when clicks on the map are recognized as part of the game. 
    // Once the user has guessed the location or run out of time (and before the start of the next round), clicking shouldn't elicit the same response from the game as it does when the game is active.
var acceptClick = false;

function resetGame(){
    // populate remainingLocations array with each element from Firebase /locations 
    locations.on("child_added", function (snap) {
        remainingLocations.push(snap.val());
        numberOfLocations=remainingLocations.length

    });
}

resetGame()

//to manage user authentication:
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        // User is signed in.
        displayName = user.displayName;
        uid = user.uid;

        $("#userDisplayName").text("Welcome: " + displayName.split(" ", 1));
        gameStats = database.ref("/stats/" + uid);
        userLoggedIn = true

        gameStats.on("value", function (childSnapshot) {
            // put all values for the user on the table
            if (childSnapshot.val().wins) {
                $("#win").text(childSnapshot.val().wins);
            }
            else {
                $("#win").text(0);
            }
            if (childSnapshot.val().losses) {

                $("#losses").text(childSnapshot.val().losses);
            }
            else {
                $("#losses").text(0);
            }
            if (childSnapshot.val().best) {

                $("#best").text(childSnapshot.val().best);
            }
            else {
                $("#best").text(0);
            }
        });

    }
    else {
        // User is signed out. So, all user dependent variables are reset below:
        gameStats = {};
        displayName = "";
        uid = "";
        userLoggedIn = false

        $("#win").text(0);
        $("#losses").text(0);
        $("#best").text(0);
        location.replace("index.html")

    }
});


$(document).ready(function () {
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown(
        {
            hover: true,
            constrainWidth: false,
            coverTrigger: false,
            alignment:'right'
        });
    
    //this modal comes up on page load (after user signs in); closing it starts the first round
    $('#modal1').modal({
        dismissible: false,
        onCloseEnd: function () { setTimeout(startRound, 500) }
    });

    $('#modal1').modal('open');
    $("#timerNum").text(moment(timer.startNumber).format('m:ss'));

    $("#roundNumber").text(roundNumber+"/"+numberOfLocations);
    $("#timerNum").addClass("light-green-text text-accent-4");
});

var timer = {
    // expressing time in milliseconds makes it easier to work with moment.js formatting
    startNumber: 120000,
    intervalId: '',
    run: function () {

        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.decrement, 1000);
    },
    decrement: function () {
        timer.startNumber -= 1000;
        var formattedTime = moment(timer.startNumber).format('m:ss');
        $("#timerNum").text(formattedTime);

        // conditional class assignment to style #timerNum according to how much time is left
        if (timer.startNumber < 60000) {
            $("#timerNum").removeClass("light-green-text text-accent-4").addClass("orange-text");
        }
        if (timer.startNumber < 31000) {
            $("#timerNum").removeClass("orange-text").addClass("red-text");
        }
        if (timer.startNumber < 11000) {
            $("#timerNum").addClass("flashit");
        }

        if (timer.startNumber === 0) {
            //loss scenario
            timer.stop();
            // time's up, so don't accept any more guesses (user can still click the map, but it won't count)
            acceptClick = false;
                                   
            losses();
            //start next round, after a short period
            setTimeout(startRound, 5000);

        }
    },
    stop: function () {
        clearInterval(this.intervalId);
    }
};

function startRound() {

    $("#distance").text("");

    // check for remaining locations from remainingLocations
        // if there are none, then game is over
        // if there are locations remaining, then randomly choose the next one and pass it to initMap
    if (remainingLocations.length === 0) {
        //end of game scenario
        
        $("#distance").text("Thanks for playing!");
    }
    else {
        var randLIndex = Math.floor(Math.random() * remainingLocations.length);

        // currentLocation will be passed to the function that sets up the map: initMap
        currentLocation = remainingLocations[randLIndex];
        // remove the selected element from remainingLocations (so that it doesn't come up again in the same game)
        remainingLocations.splice(randLIndex, 1);

        // increment roundNumber
        roundNumber++;
        $("#roundNumber").text(roundNumber+"/"+numberOfLocations);

        $("#timerNum").removeClass("flashit red-text orange-text").addClass("light-green-text text-accent-4");

        timer.startNumber = 120000;
        $("#timerNum").text(moment(timer.startNumber).format('m:ss'))
        timer.run();

        initMap(currentLocation);
        acceptClick = true;
    }
};


function signOut() {
    event.preventDefault();  
    firebase.auth().signOut().then(function () {
        window.location.replace("index.html");
        // Sign-out successful.
        
    }).catch(function (error) {
        console.log(error.code);
    });
};

function resetStats() {
    // retrieve user ID to interact with the corresponding directory in Firebase
    var userId = firebase.auth().currentUser.uid;

    database.ref('/stats/' + userId).set({
        wins: 0,
        losses: 0,
        best: 0
    })
}

function restartGame(){
    remainingLocations = [];
    resetGame();
    timer.stop();
    roundNumber=0;
    startRound();
}

function losses(){
    // Location is revealed 
    markerWindow();
    $("#distance").html("Time is Up!" + "<br>" + currentLocation.site);
    // retrieve user ID to interact with the corresponding directory in Firebase
    var userId = firebase.auth().currentUser.uid;
    var losses = 0;

    //read the stats for this user once and then update the wins
    database.ref('/stats/' + userId).once('value').then(function (snapshot) {
        if (snapshot.val() == null || snapshot.val().losses == null || snapshot.val().losses == undefined) {
            losses++
        }
        else {
            losses = snapshot.val().losses
            losses++
        }
        database.ref('/stats/' + userId).update({ losses: losses })

    });

}

$(document).on("click", "#signOut", signOut);
$(document).on("click", "#resetStats", resetStats);
$(document).on("click", "#restartGame", restartGame);




    
   
      
  
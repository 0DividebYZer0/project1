var roundNumber = 0;

var remainingLocations = [];

var database = firebase.database();

var locations = database.ref("/locations");
var gameStats = {};
var displayName = "";
var uid = "";
var userLoggedIn = false

var acceptClick = false;

locations.on("child_added", function (snap) {
    remainingLocations.push(snap.val());
});

//to manage user authentication:
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        // User is signed in.
        displayName = user.displayName;
        //   var email = user.email;
        //   var emailVerified = user.emailVerified;
        //   var photoURL = user.photoURL;
        //   var isAnonymous = user.isAnonymous;
        uid = user.uid;
        //   var providerData = user.providerData;

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
    // on load and on child_added, store contents of locations(Firebase) in an array variable
    // this represents the set of locations remaining


    //might get rid of gameStats; individual user's wins/losses don't need to be stored in Firebase.
    $('#modal1').modal({
        dismissible: false,
        onCloseEnd: function () { startRound() }
    });
    // $('#modal2').modal({
    //     dismissible: false,
    // });
    $('#modal1').modal('open');
    $("#timerNum").text(moment(timer.startNumber).format('m:ss'));

    $("#roundNumber").text(roundNumber);
    $("#timerNum").addClass("light-green-text text-accent-4");
});



var timer = {
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
            acceptClick = false;
            //display some message to indicate that time's up, and show answer
            $("#distance").html("Time's up!<br>The treasure remains hidden!");
            losses()

            //start next round
            setTimeout(startRound, 5000);
            // if (roundNumber < 5) {
            //     //do something here after timer hits zero
            //     modalNextRound();
            // }
        }
    },
    stop: function () {
        clearInterval(this.intervalId);
    }
};


function startRound() {

    $("#distance").text("");

    console.log("startRound begins");
    if (remainingLocations.length === 0) {
        //end of game scenario
        console.log("no more locations");
        $("#distance").text("Thanks for playing!");
    }
    else {
        var randLIndex = Math.floor(Math.random() * remainingLocations.length);

        // currentLocation will be passed to whatever function sets up the map: initMap
        var currentLocation = remainingLocations[randLIndex];

        remainingLocations.splice(randLIndex, 1);

        //roundNumber
        roundNumber++;
        $("#roundNumber").text(roundNumber);

        $("#timerNum").removeClass("flashit red-text orange-text").addClass("light-green-text text-accent-4");

        timer.startNumber = 120000;
        $("#timerNum").text(moment(timer.startNumber).format('m:ss'))
        timer.run();

        console.log("initMap called by startRound")

        initMap(currentLocation);
        acceptClick = true;
    }
};





// // might not use modals for transitions between rounds
// function modalNextRound() {
//     // timer/round handling
//     $("#timerNum").removeClass("flashit").addClass("light-green-text text-accent-4");
//     roundNumber++;
//     $("#roundNumber").text(roundNumber);
//     timer.startNumber = 5000;
//     $("#timerNum").text(moment(timer.startNumber).format('m:ss'));

//     // modal construction
//     var roundCompleted = $('<p>');
//     var instructions = $('<p>');
//     roundCompleted.text('Round Completed');
//     instructions.text('Click Next Round when you are ready to begin the next round.');
//     $('.modal-content').empty();
//     $('.modal-content').append(roundCompleted);
//     $('.modal-content').append(instructions);
//     $('#modal-btn').text('Next Round');
//     $('#modal1').modal('open');
// };



$(document).on("click", "#signOut", signOut);

function signOut() {
    event.preventDefault();
    console.log("sign out pressed");


    firebase.auth().signOut().then(function () {
        window.location.replace("index.html");
        // Sign-out successful.
        console.log("sign out");
    }).catch(function (error) {
        console.log(error.code);
    });
};

function losses() {
    //first i get the id
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
function resetStats() {
    var userId = firebase.auth().currentUser.uid;

    database.ref('/stats/' + userId).set({
        wins: 0,
        losses: 0,
        best: 0
    })
}


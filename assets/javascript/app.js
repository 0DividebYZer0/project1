var roundNumber = 1;

var remainingLocations = [];

var database = firebase.database();

var locations = database.ref("/locations");

locations.on("child_added", function(snap) {
    remainingLocations.push(snap.val());
});

$(document).ready(function () {
    
    var gameStats = database.ref("/stats");
    

    // on load and on child_added, store contents of locations(Firebase) in an array variable
    // this represents the set of locations remaining


    //might get rid of gameStats; individual user's wins/losses don't need to be stored in Firebase.
    gameStats.on("value", function(childSnapshot) {
        // Store everything into a variable.
        $("#win").text(childSnapshot.val().wins);
        $("#losses").text(childSnapshot.val().losses);
        $("#best").text(childSnapshot.val().best);
    });


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
        if(timer.startNumber < 31000){
            $("#timerNum").removeClass("orange-text").addClass("red-text");
        }       
        if(timer.startNumber < 11000){
            $("#timerNum").addClass("flashit");
        }

        if (timer.startNumber === 0) {
            timer.stop();
            if (roundNumber < 5) {
                //do something here after timer hits zero
                modalNextRound();
            }
        }
    },
    stop: function () {
        clearInterval(this.intervalId);
    }
};


function startRound() {

    console.log("startRound begins");
    if (remainingLocations.length === 0) {
        //end of game scenario
        console.log("no more locations");
    }
    else {
        var randLIndex = Math.floor(Math.random() * remainingLocations.length);

        // currentLocation will be passed to whatever function sets up the map: initMap
        var currentLocation = remainingLocations[randLIndex];

        remainingLocations.splice(randLIndex, 1);

        timer.run();

        console.log("initMap called by startRound")
        initMap(currentLocation);
    }
};


function displayAnswer() {

};


// might not use modals for transitions between rounds
function modalNextRound() {
    // timer/round handling
    $("#timerNum").removeClass("flashit").addClass("light-green-text text-accent-4");
    roundNumber++;
    $("#roundNumber").text(roundNumber);
    timer.startNumber = 120000;
    $("#timerNum").text(moment(timer.startNumber).format('m:ss'));

    // modal construction
    var roundCompleted = $('<p>');
    var instructions = $('<p>');
    roundCompleted.text('Round Completed');
    instructions.text('Click Next Round when you are ready to begin the next round.');
    $('.modal-content').empty();
    $('.modal-content').append(roundCompleted);
    $('.modal-content').append(instructions);
    $('#modal-btn').text('Next Round');
    $('#modal1').modal('open');
};



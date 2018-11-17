var database = firebase.database();
var gameStats={};
var displayName="";
var uid="";
var userLoggedIn=false

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
      displayName = user.displayName;

      uid = user.uid;
      gameStats = database.ref("/stats/"+uid);
      userLoggedIn=true

  } 
  else {
    // User is signed out. So, all user dependent variables are reset below:
    gameStats={};
    displayName="";
    uid="";   
    userLoggedIn=false

    $("#win").text(0);
    $("#losses").text(0);
    $("#best").text(0);

  }
});



function initMap(locationInput) {
  // locations.on("child_added", function(loc){
  //   locationObject.push(loc.val());

  
  var origin = {};

    //don't use a for loop, but apply the origin property assignments to locationInput properties
      // for(var i = 0; i<locationObject.length; i++){
      //     origin.lat = Number(locationObject[i].lat);
      //     origin.lng = Number(locationObject[i].lng);
      //     origin.id = locationObject[i].id; 
      //     origin.site = locationObject[i].site;
      //     origin.clues = locationObject[i].clues;
      // }
  
    origin.lat = Number(locationInput.lat);
    origin.lng = Number(locationInput.lng);
    origin.id = locationInput.id; 
    origin.site = locationInput.site;
    origin.clues = locationInput.clues;
    origin.pictureClue = locationInput.pictureClue;

    //display clues on page
    for (var i = 0; i < origin.clues.length; i++) {
      $("#clue-" + i).text(origin.clues[i]);
    };

     // image clue
    var gif =  origin.pictureClue;
    // console.log(gif)
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&api_key=dc6zaTOxFJmzC&limit=9";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        var result = response.data[0].images.fixed_height_still.url;
        console.log(result);
        var image = $("<img>");
        image.addClass('image');
        image.attr("src", result);
        $("#gif").html(image);
      });

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      // need to add some random offset from origin for center; otherwise, the map view is centered at the origin
      center: origin,
    });
    var clickHandler = new ClickEventHandler(map, origin);
    var id = clickHandler.origin.id;

    
}


/**
 * @constructor
 */
var ClickEventHandler = function(map, origin) {
  this.origin = origin;
  this.map = map;
  this.display = new google.maps.DirectionsRenderer; 
  this.display.setMap(map);
  this.infowindow = new google.maps.InfoWindow;
  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
};//end of ClickEventHandler

//on click map function
ClickEventHandler.prototype.handleClick = function(event){

  if (acceptClick) {
    if (event.placeId) {
      var target = new google.maps.LatLng(this.origin.lat, this.origin.lng);
      // verifies that user clicks on the correct location
      if(event.placeId === this.origin.id){

        //STOP CLOCK HERE
        timer.stop()
        acceptClick = false;

       // marker functionality  *** ADD TO STOP FUNCTION ***
       // moved to displayAnswer function
          var marker = new google.maps.Marker({
            position: target,
            map: this.map,
            title: this.site,
            animation: google.maps.Animation.DROP
          });

        //info window contents *** CHANGE MESSAGE & ADD TO STOP FUNCTION ***
        var infowindow = new google.maps.InfoWindow({
          content: '<div align ="center">  Good Job!' + '<br>' + 'The Treasure Was Hidden In The' + '<br>' + this.origin.site  +'</div>'
        });
        //info window opens *** ADD TO STOP FUNCTION ***
        infowindow.open(map, marker);

        //update main clue
        $('#distance').html(this.origin.site);

        //win is update after user finds location
        updateWins() 
        //win is updated in html
        //$('#win').html(win);

        setTimeout(startRound, 5000);
      } else{
          //user picked the worng location and is given a distance clue
            var distance = google.maps.geometry.spherical.computeDistanceBetween(event.latLng, target);
            distance= Math.round(distance);
            $('#distance').text('You are ' + distance + ' Meters Away');
          
      }
      // Calling e.stop() on the event prevents the default info window from
      event.stop();
    }
  };
};



//console.log(firebase.auth().currentUser.uid)


function updateWins(){
  //first i get the id
  var userId = firebase.auth().currentUser.uid;
  var wins=0;

  //read the stats for this user once and then update the wins
  database.ref('/stats/' + userId).once('value').then(function(snapshot) {
    wins=snapshot.val().wins
    if (wins){
      wins++
    }
    else{
      wins=1
    }
    database.ref('/stats/' + userId).update({wins:wins})

  });

}

// function displayAnswer() {
    

//   //drop marker
//   var marker = new google.maps.Marker({
//     position: target,
//     map: ClickEventHandler.map,
//     title: ClickEventHandler.site,
//     animation: google.maps.Animation.DROP
//   });



//   setTimeout(startRound, 5000)
// };


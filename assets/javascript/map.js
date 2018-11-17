
//win variable; probably move this to app.js
var win = 0; 







//MapPoint constructor used by the initMap function; don't need this anymore
// function MapPoint(lat, lng, id, site, clues){
//   this.lat = lat
//   this.lng = lng
//   this.id = id
//   this.site = site
//   this.clues = clues
// }



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

    //display clues on page
    for (var i = 0; i < origin.clues.length; i++) {
      $("#clue-" + i).text(origin.clues[i]);
    };

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      // need to add some random offset from origin for center; otherwise, the map view is centered at the origin
      center: origin,
    });
    var clickHandler = new ClickEventHandler(map, origin);
    var id = clickHandler.origin.id;

  // });
  
// var location =[
//     new MapPoint( 43.72296315907589, 10.396585464477539, 'ChIJzYhOxKaR1RIRA_xU1bGp7DI','Leaning Tower Of Pisa',
//       ['286 Meters from Piazza Del Duomo', 'Took 2 Centuries to Built', 'Is 183.27 Feet Height']),

//     new MapPoint(40.756686,-73.973078, 'ChIJTzi6VfxYwokRDtjrgLbTvH4', 'Waldorf Astoria', 
//       ['Is located at 301 Park Ave','Marilyn Monroe Moved in 1955','Has 6 Beehives on its Roof']),
    
//     new MapPoint(48.852968, 2.349902, 'ChIJATr1n-Fx5kcRjQb6q6cdQDY', 'Cathedral Notre Dame De Paris', 
//       ['Is Located on Île de la Cité','Was Built Around 1710', 'Features 39 Gargoyles']),
    
//     new MapPoint(-33.863666,151.211458, 'ChIJ_1pC8mmuEmsRrvud0Ftcoyg', 'Museum Of Sydney', 
//       ['Is 845 Meters from the Sydney Opera House','Located on Bridge St','Was Once Australias First Government House']),
    
//     new MapPoint(51.50074202015363,-0.12462615966796875, 'ChIJ2dGMjMMEdkgRqVqkuXQkj7c', 'Big Ben', 
//     ['Was Designed by Architect	Augustus Pugin','Is Close to Westminster Bridge','Weighs 13.7 Tonnes'])

//   ]  

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
        win++; 
        //win is updated in html
        $('#win').html(win);

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

//win variable
var win = 0; 

//MapPoint constructor used by the initMap function
function MapPoint(lat, lng, id, site, clues){
  this.lat = lat
  this.lng = lng
  this.id = id
  this.site = site
  this.clues = clues
}


function initMap() {
var location =[
    new MapPoint(40.808884,-73.961224, 'ChIJyQ3Tlj72wokRUCflR_kzeVc','Columbia University School',
      ['Is Located 116th St & Broadway', 'Was Established in 1754', 'It\'s Mascot is a Lion'])

    // new MapPoint(40.756686,-73.973078, 'ChIJTzi6VfxYwokRDtjrgLbTvH4', 'Waldorf Astoria', 
    //   ['Is located at 301 Park Ave','Marilyn Monroe Moved in 1955','Has 6 Beehives on its Roof']),
    
    // new MapPoint(48.852968, 2.349902, 'ChIJATr1n-Fx5kcRjQb6q6cdQDY', 'Cathedral Notre Dame De Paris', 
    //   ['Is Located on Île de la Cité','Was Built Around 1710', 'Features 39 Gargoyles']),
    
    // new MapPoint(-33.863666,151.211458, 'ChIJ_1pC8mmuEmsRrvud0Ftcoyg', 'Museum Of Sydney', 
    //   ['Is 845 Meters from the Sydney Opera House','Located on Bridge St','Was Once Australias First Government House']),
    
    // new MapPoint(51.50074202015363,-0.12462615966796875, 'ChIJ2dGMjMMEdkgRqVqkuXQkj7c', 'Big Ben', 
    // ['Was Designed by Augustus Pugin','Is Close to Westminster Bridge','Weighs 13.7 Tonnes'])

  ]     

//origin object which is fed by location array
var origin = {};

//GAME FLOW MOCK UP
  for(var i = 0; i<location.length; i++){
      origin.lat = location[i].lat;
      origin.lng = location[i].lng;
      origin.id = location[i].id; 
      origin.site = location[i].site;
      origin.clues = location[i].clues;
  }

  // clues from location array renders into html 
  for(j =0; j< origin.clues.length; j++){
   var clue = '#clue-' + j
    $(clue).html(origin.clues[j]);
  }

  // map functionality which renders map 
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: origin,
  });
  var clickHandler = new ClickEventHandler(map, origin);
  var id = clickHandler.origin.id;
}// end of initMap function


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
  if (event.placeId) {
    var target = new google.maps.LatLng(this.origin.lat, this.origin.lng);
    // verifies that user clicks on the correct location
    if(event.placeId === this.origin.id){

      //STOP CLOCK HERE

      // marker functionality  *** ADD TO STOP FUNCTION ***
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
    } else{
         //user picked the worng location and is given a distance clue
          var distance = google.maps.geometry.spherical.computeDistanceBetween(event.latLng, target);
          distance= Math.round(distance);
          $('#distance').text('You are ' + distance + ' Meters Away');
         
    }
    // Calling e.stop() on the event prevents the default info window from
    event.stop();
<<<<<<< HEAD
  }//end of event.placeId

};// end of handleClick function
=======
  }
};
>>>>>>> 44eac428a1423cdeb94a78afaa37762448f03db9

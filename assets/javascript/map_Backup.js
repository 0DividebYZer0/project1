
//Where should this be defined? capture in db
var win = 0; 

function MapPoint(lat, lng, id, site, clues){
  this.lat = lat
  this.lng = lng
  this.id = id
  this.site = site
  this.clues = clues
}

function initMap() {
var location =[
    new MapPoint( 43.72296315907589, 10.396585464477539, 'ChIJzYhOxKaR1RIRA_xU1bGp7DI','Leaning Tower Of Pisa',
      ['286 Meters from Piazza Del Duomo', 'Took 2 Centuries to Built', 'Is 183.27 Feet Height']),

    new MapPoint(40.756686,-73.973078, 'ChIJTzi6VfxYwokRDtjrgLbTvH4', 'Waldorf Astoria', 
      ['Is located at 301 Park Ave','Marilyn Monroe Moved in 1955','Has 6 Beehives on its Roof']),
    
    new MapPoint(48.852968, 2.349902, 'ChIJATr1n-Fx5kcRjQb6q6cdQDY', 'Cathedral Notre Dame De Paris', 
      ['Is Located on Île de la Cité','Was Built Around 1710', 'Features 39 Gargoyles']),
    
    new MapPoint(-33.863666,151.211458, 'ChIJ_1pC8mmuEmsRrvud0Ftcoyg', 'Museum Of Sydney', 
      ['Is 845 Meters from the Sydney Opera House','Located on Bridge St','Was Once Australias First Government House']),
    
    new MapPoint(51.50074202015363,-0.12462615966796875, 'ChIJ2dGMjMMEdkgRqVqkuXQkj7c', 'Big Ben', 
    ['Was Designed by Architect	Augustus Pugin','Is Close to Westminster Bridge','Weighs 13.7 Tonnes'])

  ]     

var origin = {};
  for(var i = 0; i<location.length; i++){
      origin.lat = location[i].lat;
      origin.lng = location[i].lng;
      origin.id = location[i].id; 
      origin.site = location[i].site;
      origin.clues = location[i].clues;
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
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
};


ClickEventHandler.prototype.handleClick = function(event){
  if (event.placeId) {
    var target = new google.maps.LatLng(this.origin.lat, this.origin.lng);

    if(event.placeId === this.origin.id){
      var marker = new google.maps.Marker({
        position: target,
        map: this.map,
        title: this.site,
        animation: google.maps.Animation.DROP
      });

      var infowindow = new google.maps.InfoWindow({
        content: '<div align ="center">  Good Job!' + '<br>' + 'The Treasure Was Hidden In the' + '<br>' + this.origin.site  +'</div>'
      });
      infowindow.open(map, marker);
      $('#liveClue').html('You Got It!!!');

      // Where should this be defined? capture in db
      win++; 
      $('#win').html(win);
    }
    else{
          var distance = google.maps.geometry.spherical.computeDistanceBetween(event.latLng, target);
          distance= Math.round(distance);
          $('#liveClue').html('You Are ' + distance + ' Meters Away');
          console.log(event.latLng);
    }
    // Calling e.stop() on the event prevents the default info window from
    event.stop();
  }

};

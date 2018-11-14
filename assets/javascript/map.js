// <!DOCTYPE html>
// <html>
//   <head>
//     <title>map</title>
//     <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
//     <meta charset="utf-8">
//     <style>
//       /* Always set the map height explicitly to define the size of the div
//        * element that contains the map. */
//       #map {
//         height: 70%;
//       }
//       /* Optional: Makes the sample page fill the window. */
//       html, body {
//         height: 100%;
//         margin: 0;
//         padding: 0;
//       }
//       .title {
//         font-weight: bold;
//       }
//       #infowindow-content {
//         display: none;
//       }
//       #map #infowindow-content {
//         display: inline;
//       }
//     </style>
//   </head>
//   <body>
//     <div id="map"></div>
//     <br>
//     <div>NEXT</div>
    
//     <script>

      function MapPoint(lat, lng, id, site){
        this.lat = lat
        this.lng = lng
        this.id = id
        this.site = site
      }

      function initMap() {
       var location =[
         new MapPoint(40.751758, -73.975519, 'ChIJeWPFRwJZwokRGD60OOo74RU', 'NYC Chrysler Building'),
         new MapPoint(48.8566, 2.3522, 'ChIJATr1n-Fx5kcRjQb6q6cdQDY', 'Cathedral Notre Dame de Paris')
       ]         
        var origin = {};

        console.log(location);

         for(var i = 0; i<location.length; i++){
            origin.lat = location[i].lat;
            origin.lng = location[i].lng;
            origin.id = location[i].id; 
            origin.site = location[i].site; 
         }
      
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
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

     

      ClickEventHandler.prototype.handleClick = function(event) {
        
        if (event.placeId) {
          
          if(event.placeId === this.origin.id){
            alert('You are Correct This is :' + this.origin.site);
          }
          // Calling e.stop() on the event prevents the default info window from
          // showing.
          // If you call stop here when there is no placeId you will prevent some
          // other map click event handlers from receiving the event.
          event.stop();
        }

      };



      
   
    // </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAAGBxD7ehhnDQY_7b7l30Spt5l4F8EQf4&libraries=places&callback=initMap" 
    async defer></script>


//   </body>
// </html>
     
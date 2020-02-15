var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  getQuakeCircles(data.features);
});


function getQuakeCircles(earthquakeData) { 
    
      var myData = earthquakeData;
    
      var circleData = [];
      var quakeData = [];
      
      console.log(myData);

      for (var i = 0; i < myData.length; i++) {
          var quake = myData[i];
          quakeData.push(quake);
        // console.log(quake);
      }
        console.log(quakeData); 
  
// Loop through the cities array and create one marker for each city object
    for (var i = 0; i < quakeData.length; i++) {

      var color = "";
          if (quakeData[i].properties.mag < 1) {
            color = "yellow";
          }
          else if (quakeData[i].properties.mag < 2) {
            color = "orange";
          }
          else {
            color = "red";
          }
      myRadius = quakeData[i].properties.mag * 50000;
      // console.log(myRadius); 
      // console.log(quakeData[i].geometry.coordinates);
      var myCoords = [];
      myCoords = [quakeData[i].geometry.coordinates[1], quakeData[i].geometry.coordinates[0]];
      // console.log(myCoords);

      circleData.push(L.circle(myCoords, {
        fillOpacity: 0.5,
        color: color,
        fillColor: color,
        // fillColor: "red",
        radius: myRadius
      })
      .bindPopup("<h2>" + quakeData[i].properties.place + "</h2> <hr> <h4>Magnitude: " + quakeData[i].properties.mag + "</h4>"))
      // .addTo(myMap)
      ;
      }
          console.log(circleData);
          quakemap = L.layerGroup(circleData)
          createMap(quakemap); 

  };

function createMap(quakemap) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-basic",
      accessToken: API_KEY
    })

    var nightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    /////////////////////////////////////////////////////////////
    ////////////START DEFINING MAPS AND LAYERS //////////////////
    /////////////////////////////////////////////////////////////

    var baseMaps = {
      Streetmap: streetmap,
      Nightmap: nightmap,
      Satellite: satmap
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
      Earthquakes: quakemap
    };

    // Create a map object
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, quakemap]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
}

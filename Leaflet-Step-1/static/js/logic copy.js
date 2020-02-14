// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
// var allFeatures = {};

function markerSize(magnitude) {
    return magnitude * 1000;
  }

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  myQuakes = createMyQuakes(data.features);
  earthquakes = createFeatures(data.features);

  createMap(myQuakes, earthquakes);
});

function createMyQuakes(earthquakeData) {
      // Now create a layer in the format requested by the homework
      console.log(earthquakeData)
      var quakeMarkers = [];
  
      // Loop through all records in allFeatures and populate coordinates and circle size
      for (var i = 0; i < earthquakeData.length; i++) {
          // Setting the marker radius for the state by passing population into the markerSize function
          quakeMarkers.push(
              L.circle(earthquakeData[i].geometry.coordinates, {
              stroke: false,
              fillOpacity: 0.75,
              color: "white",
              fillColor: "white",
              radius: markerSize(earthquakeData[i].properties.mag)
              // radius: +1000
              })
          );
          // console.log(earthquakeData[i].geometry.coordinates, earthquakeData[i].properties.mag )
          console.log(earthquakeData[i].geometry.coordinates);
          console.log(earthquakeData[i].properties.mag );
          console.log(quakeMarkers[i].options.radius);
  
      };
  
      // turn quakeMarkers into layerGroup  
      var myQuakes = L.layerGroup(quakeMarkers);
  
      console.log(myQuakes)
      return myQuakes;
}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        // console.log(feature)
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });


    return earthquakes;
  // Sending both earthquakes layers to the createMap function
  
}

function createMap(myQuakes, earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

// Define streetmap and darkmap layers
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "MyEarthquakes": myQuakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    // layers: [satellitemap, myQuakes]
    layers: [satellitemap, earthquakes]

});

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

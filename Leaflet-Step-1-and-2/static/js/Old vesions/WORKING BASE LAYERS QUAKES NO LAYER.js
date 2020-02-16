var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-03";

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

// Perform a GET request to the query URL
var quakemap = L.layerGroup(d3.json(queryUrl, function(data) {

  var myQuakes = [];
  var myData = data.features;
  console.log(myData);

  for (var i = 0; i < myData.length; i++) {
    var quake = myData[i];
    myQuakes.push(quake);
    console.log(quake);}

    console.log(myQuakes); 
  
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(myQuakes);
}));

function createFeatures(quakeData) {
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
  // Add circles to map
  myRadius = quakeData[i].properties.mag * 30000;
  // console.log(myRadius); 
  console.log(quakeData[i].geometry.coordinates);
  
  myCoords = [];
  myCoords = [quakeData[i].geometry.coordinates[1], quakeData[i].geometry.coordinates[0]];;
  console.log(myCoords);

  L.circle(myCoords, {
    fillOpacity: 0.5,
    color: color,
    fillColor: color,
    // fillColor: "red",
    radius: myRadius
  })
  .bindPopup("<h2>" + quakeData[i].properties.place + "</h2> <hr> <h4>Magnitude: " + quakeData[i].properties.mag + "</h4>")
  .addTo(myMap);
}}

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

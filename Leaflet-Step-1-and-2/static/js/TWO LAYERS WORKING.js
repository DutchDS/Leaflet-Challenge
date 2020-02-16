var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-04";

///////////////////////////////////////////////////////////////////////////
//// Retrieve the data and start defining circles to plot /////////////////
///////////////////////////////////////////////////////////////////////////

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  getQuakeCircles(data.features);
});

////////////////////////////////////////////////////////////////////////////
//// Using the retrieved data, create a circle data array for the layer ////
////////////////////////////////////////////////////////////////////////////

function getQuakeCircles(earthquakeData) { 
    
      var myData = earthquakeData;
      var circleData = [];
      var quakeData = [];
      
      console.log(myData);

      for (var i = 0; i < myData.length; i++) {
          var quake = myData[i];
          quakeData.push(quake);
      }
        console.log(quakeData); 
  
//// Loop through the magnitutdes and assign colors ////
    for (var i = 0; i < quakeData.length; i++) {

      var color = "";
          if (quakeData[i].properties.mag < 1) {
            color = "rgb(200, 250, 19)";
          }
          else if (quakeData[i].properties.mag < 2) {
            color = "rgb(250, 246, 19)";
          }
          else if (quakeData[i].properties.mag < 3) {
            color = "orange";
          }          
          else if (quakeData[i].properties.mag < 4) {
            color = "rgb(207, 70, 28)";
          }         
          else if (quakeData[i].properties.mag < 5) {
            color = "rgb(150, 3, 3)";
          }
          else {
            color = "rgb(121, 2, 2)";
          }

      myRadius = quakeData[i].properties.mag * 30000;
      // console.log(myRadius); 
      // console.log(quakeData[i].geometry.coordinates);
      var myCoords = [];
      myCoords = [quakeData[i].geometry.coordinates[1], quakeData[i].geometry.coordinates[0]];
      
      //// Append each circle definition to circleData ////
      circleData.push(L.circle(myCoords, {
        fillOpacity: 0.75,
        color: color,
        fillColor: color,
        radius: myRadius
      })
      .bindPopup("<h2>" + quakeData[i].properties.place + "</h2> <hr> <h4>Magnitude: " + quakeData[i].properties.mag + "</h4>"));
    }
          // console.log(circleData);
          quakemap = L.layerGroup(circleData)

          bounderies = createBounderiesMap(quakemap)

  };

  
 function createBounderiesMap(quakemap) {
    var geoData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  
    var mapStyle = {
      color: "blue",
      fillColor: "pink",
      fillOpacity: 0.5,
      weight: .25
    };

  // Grab data with d3
  d3.json(geoData, function(data) {
  
  });
  
    function onEachFeature(feature, layer) {
      style = mapStyle// layer.bindPopup("hello");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var bounderies = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    
    createMap(quakemap, bounderies); 
    
  }
////////////////////////////////////////////////////////////////////////////
//// now create all the maps when this function is called in the end ///////
////////////////////////////////////////////////////////////////////////////

function createMap(quakemap, bounderies) {

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

    //// DEFINE MAPS AND LAYERS AND DISPLAY //////////////////
    var baseMaps = {
      Streetmap: streetmap,
      Nightmap: nightmap,
      Satellite: satmap
    };

    var overlayMaps = {
      Earthquakes: quakemap,
      Boundaries: bounderies
    };

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 3,
      layers: [satmap, quakemap, bounderies]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
}

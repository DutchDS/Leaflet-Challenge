// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-04";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var my_zoom = 3;
var radius_ratio = 40000;
var my_coord = [37.09, -95.71]
///////////////////////////////////////////////////////////////////////////
//// Retrieve the data and start defining circles to plot /////////////////
///////////////////////////////////////////////////////////////////////////

function startMap(my_zoom, radius_ratio, my_coord) {

  console.log(my_zoom, radius_ratio, my_coord)
  d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  getQuakeCircles(data.features, my_zoom, radius_ratio, my_coord);
});
}

startMap(my_zoom, radius_ratio, my_coord)

function initializingMap() // call this method before you initialize your map.
  { 
    var container = L.DomUtil.get('map');
      console.log(container);
      if(container != null){
      container._leaflet_id = null;
  }
}

////////////////////////////////////////////////////////////////////////////
//// Using the retrieved data, create a circle data array for the layer ////
////////////////////////////////////////////////////////////////////////////

function getQuakeCircles(earthquakeData, my_zoom, radius_ratio, my_coord) { 
    
      var myData = earthquakeData;
      var circleData = [];
      var quakeData = [];
      
      console.log(myData);
      console.log(my_coord);

      for (var i = 0; i < myData.length; i++) {
          var quake = myData[i];
          quakeData.push(quake);
      }
        console.log(quakeData); 
  
//// Loop through the magnitutdes and assign colors ////
    for (var i = 0; i < quakeData.length; i++) {

      var color = "";
          if (quakeData[i].properties.mag < 1) {
            color = "#008000";
          }
          else if (quakeData[i].properties.mag < 2) {
            color = "#7DC000";
          }
          else if (quakeData[i].properties.mag < 3) {
            color = "	#ffff00";
          }          
          else if (quakeData[i].properties.mag < 4) {
            color = "#ffa500";
          }         
          else if (quakeData[i].properties.mag < 5) {
            color = "#ff0000";
          }
          else {
            color = "#800000";
          }

      myRadius = quakeData[i].properties.mag * radius_ratio;
      // console.log(myRadius); 
      // console.log(quakeData[i].geometry.coordinates);
      var myCoords = [];
      myCoords = [quakeData[i].geometry.coordinates[1], quakeData[i].geometry.coordinates[0]];
      var myDate = Date(quakeData[i].properties.date)
      //// Append each circle definition to circleData ////
      circleData.push(L.circle(myCoords, {
        fillOpacity: .75,
        color: color,
        fillColor: color,
        radius: myRadius
      })
      .bindPopup("<h2>" + quakeData[i].properties.place + "</h2> <hr> <h4>Magnitude: " 
                        + quakeData[i].properties.mag + "</h4> <hr> <h4>Date: " 
                        + myDate + "</h4>"));
    }
          console.log(circleData);
          quakemap = L.layerGroup(circleData);
          console.log(my_coord);
          bounderies = createBounderiesMap(quakemap,my_zoom, my_coord);

  };
  
 function createBounderiesMap(quakemap, my_zoom, my_coord) {
    var geoData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  
    console.log(my_coord);
  // Grab data with d3
  d3.json(geoData, function(data) {
    
    function onEachFeature(feature, layer) {}
  
    var bounderies = L.geoJSON(data, {
      onEachFeature: onEachFeature,
      color: "lightblue",
      weight: 3
    });
  
    createMap(quakemap, bounderies,my_zoom, my_coord); 
    });
  }
////////////////////////////////////////////////////////////////////////////
//// now create all the maps when this function is called in the end ///////
////////////////////////////////////////////////////////////////////////////

function createMap(quakemap, bounderies, my_zoom, my_coord) {

    document.getElementById('map').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    
    initializingMap()

    var streetmap = new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-basic",
      accessToken: API_KEY
    })

    var nightmap = new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var satmap = new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
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
    
    console.log(my_coord);
    var myMap = new L.map("map", {
      center: my_coord,
      zoom: my_zoom,
      layers: [satmap, quakemap, bounderies]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

/*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitude</h4>";
  div.innerHTML += '<i style="background: #008000"></i><span>0 - 1</span><br>';
  div.innerHTML += '<i style="background: #7DC000"></i><span>1 - 2</span><br>';
  div.innerHTML += '<i style="background: #ffff00"></i><span>2 - 3</span><br>';
  div.innerHTML += '<i style="background: #ffa500"></i><span>3 - 4</span><br>';
  div.innerHTML += '<i style="background: #ff0000"></i><span>4 - 5</span><br>';
  div.innerHTML += '<i style="background: #800000"></i><span>> 5</span><br>';  

  return div;
};

legend.addTo(myMap);

myMap.on('zoomend', function() {
  var currentZoom = myMap.getZoom();
  console.log(currentZoom);
  if (currentZoom>5 && currentZoom<7) {
      var my_zoom = 6;
      var radius_ratio = 10000;
      var temp_coord = myMap.getCenter();
      var my_coord = [temp_coord.lat, temp_coord.lng];
      myMap.remove();
      startMap(my_zoom, radius_ratio, my_coord)}
  else if (currentZoom > 8 && currentZoom <10) {
      var my_zoom = 9;
      var radius_ratio = 2000;
      var temp_coord = myMap.getCenter();
      var my_coord = [temp_coord.lat, temp_coord.lng];
      myMap.remove();
      startMap(my_zoom, radius_ratio, my_coord)}
  else if (currentZoom >= 12) {
      var my_zoom = 12;
      var radius_ratio = 300;
      var temp_coord = myMap.getCenter();
      var my_coord = [temp_coord.lat, temp_coord.lng];
      myMap.remove();
      startMap(my_zoom, radius_ratio, my_coord)}
  else if (currentZoom <= 3) {
      var my_zoom = 3;
      var radius_ratio = 40000;
      var temp_coord = myMap.getCenter();
      var my_coord = [temp_coord.lat, temp_coord.lng];
      myMap.remove();
      startMap(my_zoom, radius_ratio, my_coord)}

    


    ////////////////////////////BACK TO WHERE IT WORKS ///////////////////////    
    });

  

}


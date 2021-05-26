// Add console.log to check to see if our code is working
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps={
    "Streets": streets,
    "Satellite": satelliteStreets
};

// Create the earthquake layer for our map.
let earthquakes=new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    Earthquakes: earthquakes
  };

// Create the map object with center, zoom level and default layer.
let map=L.map("mapid",{
    center:[39.5,-98.5],
    zoom:3,
    layers:[streets]
})

// pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps,overlays).addTo(map);

// Accessing the Toronto airline routes GeoJSON URL.

let earthquakeData="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    }
}

function getColor(magnitude) {
    if (magnitude>5) {
        return "#ea2c2c";
    }
    else if (magnitude > 4) {
        return "#ea822c";
    }
    else if (magnitude > 3) {
        return "#ee9c00";
    }
    else if (magnitude > 1) {
        return "#d4ee00";
      }
    else {return "#98ee00";
    }
}

function getRadius(magnitude) {
    if (magnitude === 0) {return 1}
    return magnitude *4;
};

// Grabbing our GeoJSON data.

d3.json(earthquakeData).then(function (data) {
    L.geoJSON(data,{
        //set the style for each circleMarker
        style: styleInfo,
        //turn each feature into a circleMarker on the map using pointToLayer
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng).bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place)
        }
    }).addTo(earthquakes);

    // Then we add the earthquake layer to our map.
    earthquakes.addTo(map);
});
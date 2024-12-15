// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
let myMap = L.map("map", {
    center: [37.5, -122.5], // Centered on the US
    zoom: 5 // Starting zoom level
  });

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define the earthquake GeoJSON URL (Past 7 Days Example)
let geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch the JSON data and plot it on the map
fetch(geojsonUrl)
    .then(response => response.json()) 
    .then(data => {
        console.log(data); 
        // Add earthquake data to the map
        L.geoJSON(data, {
            // Create circle markers instead of pins
            pointToLayer: function (feature, latlng) {
                let magnitude = feature.properties.mag;
                let color = magnitude > 5 ? "red" : magnitude > 3 ? "orange" : "yellow";

                return L.circleMarker(latlng, {
                    radius: magnitude * 3, // Adjust marker size based on magnitude
                    fillColor: color,
                    color: "black",
                    weight: 1,
                    fillOpacity: 0.8
                });
            },
            // Add a popup for each earthquake point
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    "<strong>Location:</strong> " + feature.properties.place + "<br>" +
                    "<strong>Magnitude:</strong> " + feature.properties.mag + "<br>" +
                    "<strong>Time:</strong> " + new Date(feature.properties.time).toLocaleString()
                );
            }
        }).addTo(myMap);
    })
    .catch(error => console.error("Error fetching earthquake data: ", error));

// Create the map
let map = L.map("map").setView([40.000, -116.0000], 5);

// Initialize tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL for earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetching the GeoJSON data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Loop through each earthquake feature
        data.features.forEach(feature => {
            // Setting the 
            let coordinates = feature.geometry.coordinates;
            let mag = feature.properties.mag;
            let location = feature.properties.place;
            let depth = coordinates[2]; // Depth in kilometers
            let depthColor = getDepthColor(depth); // Color based on the depth of the earthquake

            // Creating a unique marker for each eath quake
            L.circleMarker([coordinates[1], coordinates[0]], {
                radius: mag * 3,
                color: 'black',
                weight: 1,
                fillColor: depthColor,
                fillOpacity: 0.95
            })
            .bindPopup(`<strong>Magnitude: ${mag}</strong><br>Depth: ${depth} km<br>${location}`)
            .addTo(map);
        });
    })
    .catch(error => console.error('Error fetching earthquake data:', error));

// Function used to determine the color of the circle based on the depth of the earthquake
function getDepthColor(depth) {
    return depth > 90 ? '#FF0000' : // red for earthquakes  at depth > 90 km
           depth > 70 ? '#FF4500' : // orange-red for earthquakes at a depth of 70-90 km
           depth > 50 ? '#FF8C00' : // dark orange for earthquakes at a depth of 50-70 km
           depth > 30 ? '#FFA500' : // orange for earthquakes at a depth of 30-50 km
           depth > 10 ? '#FFFF00' : // yellow for earthquakes at a depth of 10-30 km
           '#00FF00'; // lime green for for earthquakes at a depth of 0-10 km
}

// Function used to add the legend to the map
function addLegend() {
    let legend = L.control({position:'bottomright'});

    legend.onAdd = function () {
        let div = L.DomUtil.create('div','info legend');
        div.innerHTML += '<h4>Earthquake Depth (in km)</h4>';
        div.innerHTML += '<i style="background: #00FF00;"></i> -10—10 <br>';
        div.innerHTML += '<i style="background: #FFFF00;"></i> 10—30 <br>';
        div.innerHTML += '<i style="background: #FFD700;"></i> 30—50 <br>';
        div.innerHTML += '<i style="background: #FF8C00;"></i> 50—70 <br>';
        div.innerHTML += '<i style="background: #FF4500;"></i> 70—90 <br>';
        div.innerHTML += '<i style="background: #FF0000;"></i> 90+ <br>';
        return div;
    };

    legend.addTo(map);
}

// Calling the addLegend function
addLegend();
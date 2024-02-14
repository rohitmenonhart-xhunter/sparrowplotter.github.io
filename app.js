var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var retrievedIcon = L.icon({
    iconUrl: 'marker3.png',
    iconSize: [64, 64],
    iconAnchor: [15, 62],
    popupAnchor: [0, -32],
});

// Initialize Firebase
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCKuoLKspUfEKdkexgO7HD9yb0C32lFI9I",
  authDomain: "esp-location-56ece.firebaseapp.com",
  databaseURL: "https://esp-location-56ece-default-rtdb.firebaseio.com",
  projectId: "esp-location-56ece",
  storageBucket: "esp-location-56ece.appspot.com",
  messagingSenderId: "415169225788",
  appId: "1:415169225788:web:0780c061338be738b8cf39",
  measurementId: "G-NP5SHD0WWD"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Retrieve data from Firebase and plot markers
database.ref('birds').once('value', function (birdsSnapshot) {
    birdsSnapshot.forEach(function (birdSnapshot) {
        try {
            var birdData = birdSnapshot.val();
            var latitude = birdData.latitude;
            var longitude = birdData.longitude;

            // Check if latitude and longitude are valid numbers
            if (!isNaN(latitude) && !isNaN(longitude)) {
                // Add marker for each coordinate
                L.marker([latitude, longitude], { icon: retrievedIcon }).addTo(map)
                    .bindPopup(`
                        Number of Sparrows: ${birdData.numberOfSparrows}<br>
                        Gender: ${birdData.gender}<br>
                        Nest Present: ${birdData.nestPresent}<br>
                        Juveniles Present: ${birdData.juvenilesPresent}<br>
                    `);
            }
        } catch (error) {
            console.error('Error processing bird data:', error);
        }
    });
}).catch(function (error) {
    console.error('Error retrieving data from Firebase:', error);
});


map.locate({ setView: true, maxZoom: 16 });

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map);
    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Function to plot new sparrow coordinates
// Function to plot new sparrow coordinates
function plotSparrow() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var numberOfSparrows = prompt("How many sparrows?");

            if (!isNaN(numberOfSparrows)) {
                var gender = prompt("Are they male or female? (Enter 'male' or 'female')");
                var nestPresent = prompt("Do you see a nest? (Enter 'yes' or 'no')");
                var juvenilesPresent = prompt("Do you see any juveniles? (Enter 'yes' or 'no')");

                var birdId = database.ref('birds').push().key;

                var birdData = {
                    numberOfSparrows: parseInt(numberOfSparrows),
                    gender: gender.toLowerCase(),
                    nestPresent: nestPresent.toLowerCase() === 'yes',
                    juvenilesPresent: juvenilesPresent.toLowerCase() === 'yes',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };

                // Save the birdData to Firebase
                database.ref('birds/' + birdId).set(birdData);

                // Redirect to the camera page
                window.location.href = 'camera.html';
            } else {
                alert('Please enter a valid number for the number of sparrows.');
            }
        },
        function (error) {
            alert('Unable to retrieve your location. Please make sure your browser has location services enabled.');
            console.error('Geolocation error:', error);
        }
    );
}



// Set map options
var myLatLng = { lat: 7.8731, lng: 80.7718 };
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// Create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

// Create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

// Create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

// Bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

// Variable to store the destination location
var destinationLocation;

// Add this function to continuously update the user's current location
function updateCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Check if the user is close to the destination
            if (destinationLocation && google.maps.geometry.spherical.computeDistanceBetween(userLatLng, destinationLocation) < 50) { // Adjust the distance threshold as needed
                alert("You have reached your destination!");
            }

            // Reverse geocode to get the address from latitude and longitude
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': userLatLng}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        // Fill the 'from' input with the formatted address
                        document.getElementById('from').value = results[0].formatted_address;
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }, function() {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }
}

// Function to handle errors when getting user's location
function handleLocationError(browserHasGeolocation) {
    var errorMsg = browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.';
    console.log(errorMsg);
}

// Call updateCurrentLocation() to continuously monitor the user's location
updateCurrentLocation();

// Define calcRoute function
function calcRoute() {
    // Create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, // WALKING, BICYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    // Pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // Get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            // Display route
            directionsDisplay.setDirections(result);

            // Store the destination location
            destinationLocation = result.routes[0].legs[0].end_location;
        } else {
            // Delete route from map
            directionsDisplay.setDirections({ routes: [] });
            // Center map in London
            map.setCenter(myLatLng);

            // Show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}

// Create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);



// Check if geolocation is supported, and watch for position changes
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(success, error);
} else {
    alert("Geolocation is not supported by your browser");
}

var blueMarkerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // URL to the marker icon
    scaledSize: new google.maps.Size(32, 32), // Size of the marker icon
    origin: new google.maps.Point(0, 0), // Origin point of the marker icon (0,0 is the top-left corner)
    anchor: new google.maps.Point(16, 32) // Anchor point of the marker icon (where it is placed on the map)
};


        // Function to handle success of geolocation
        function success(pos) {
            // Get current position coordinates and accuracy
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            // Create marker for current position
            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: 'You are here',
                icon: blueMarkerIcon // Set the custom marker icon
            });

            // Create accuracy circle around current position
            var circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: { lat: lat, lng: lng },
                radius: accuracy
            });
        }
        function error(err) {
            if (err.code === 1) {
                alert("Please allow geolocation access");
            } else {
                alert("Cannot get location");
            }
        }
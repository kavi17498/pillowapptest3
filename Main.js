// Set map options
var myLatLng = { lat: 38.3460, lng: -0.4907 };
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

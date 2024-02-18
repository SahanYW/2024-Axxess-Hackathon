function initMap() {
    // Default location (Center of the US) in case geolocation is not supported
    const defaultLocation = { lat: 37.0902, lng: -95.7129 };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultLocation,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                findHospitals(map, userLocation);
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}
function findHospitals(map, location) {
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
        {
            location: location,
            radius: 5000, // Search within 5km radius
            type: ['hospital'],
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const hospitalDetailsList = document.getElementById('hospitalDetails'); // Ensure you have this element in your HTML
                hospitalDetailsList.innerHTML = ''; // Clear previous results

                const hospitalsJson = []; // Initialize an empty array for JSON data

                for (let i = 0; i < results.length && i < 3; i++) { // Limit to 3 results for simplicity
                    createMarker(results[i], map);

                    // Add hospital details with Google Maps directions link
                    const listItem = document.createElement('li');
                    const hospitalLocation = results[i].geometry.location;
                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospitalLocation.lat()},${hospitalLocation.lng()}`;
                    listItem.innerHTML = `${results[i].name}, Address: ${results[i].vicinity} <a href="${directionsUrl}" target="_blank">Directions</a>`;
                    hospitalDetailsList.appendChild(listItem);

                    // Add hospital data to JSON array
                    hospitalsJson.push({
                        name: results[i].name,
                        address: results[i].vicinity,
                        position: hospitalLocation.toJSON(), // Converts to a simple {lat, lng} object
                        directionsUrl: directionsUrl
                    });
                }

                // Optionally, do something with the JSON data, e.g., log it, store it, or send it to a server
                console.log(hospitalsJson);
            }
        }
    );
}

function createMarker(place, map) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, 'click', () => {
        const infoWindow = new google.maps.InfoWindow({
            content: place.name || '',
        });
        infoWindow.open(map, marker);
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    console.error(`Geolocation ${browserHasGeolocation ? 'failed' : 'not supported'}: Error getting your location`);
}

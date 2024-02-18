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
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i], map);
                }
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

var location_index = false;
var slow_mode_enabled = false;
var locations = [
		{id: 'nc', zoom: 16, color: "yellow", coords: {lat: 34.8843734, lng: -79.6951465}},
		{id: 'pa1', zoom: 16, color: "yellow", coords: {lat: 39.975162, lng: -75.1552692}},
		{id: 'oahu', zoom: 10, color: "yellow", coords: {lat: 21.4389, lng: -158.0001}},
		{id: 'pa2', zoom: 17, color: "yellow", coords: {lat: 39.980308, lng: -75.1887163}},
		{id: 'stockholm', zoom: 11, color:"blue", coords: {lat: 59.7294, lng: 13.2354}},
		{id: 'miss', zoom: 10, color: "blue", coords: {lat: 33.6512, lng: -90.2093}},
		{id: 'nyc1', zoom: 17, color:"yellow", coords: {lat: 40.7987746, lng: -73.9674972}},
		{id: 'paris', zoom: 10, color: "blue", coords: {lat: 48.8566, lng: 2.3522}},
		{id: 'fivespot', zoom: 16, color: "yellow", coords: {lat: 40.7272745, lng: -73.9911545}},
		{id: 'russ', zoom: 10, color: "blue", coords: {lat: 54.4099, lng: 29.6935}},
		{id: 'tanganyika', zoom: 10, color:"blue",coords: {lat: -6.7924, lng: 39.2083}},
		{id: 'ghana', zoom: 10, color:"blue", coords: {lat: 5.6037, lng: -0.1870}},
		{id: 'bahia', zoom: 10, color:"blue", coords: {lat: -12.9777, lng: -38.5016}},
		{id: 'nyc2', zoom: 15, color:"pink", coords: {lat: 40.7870, lng: -73.9680}},
		{id: 'liberia', zoom: 10, color:"pink", coords: {lat: 6.3156, lng: -10.8074}},
		{id: 'africa', zoom: 4, color:"pink", coords: {lat: 0, lng: 25}},
		{id: 'railroad', zoom: 13, color: "blue", coords: {lat: 38.414627, lng: -76.17476}},
		{id: 'dahomey', zoom: 11, color:"pink", coords: {lat: 7.1855, lng: 1.9979}},
		{id: 'ole', zoom: 8, color:"pink", coords: {lat: 37.5443, lng: -4.7278}},
		{id: 'india', zoom: 10, color:"pink", coords: {lat: 25.3176, lng: 82.9739}},
		{id: 'brasilia', zoom: 8, color:"pink", coords: {lat: -15.8267, lng: -47.9218}},
		{id: 'vanguard', zoom: 16, color: "yellow", coords: {lat: 40.7360,lng: -74.0017}},
		{id: 'japan', zoom: 14, color:"yellow", coords: {lat: 32.7759862, lng: 129.8631768}},
		{id: 'tunji', zoom: 10, color:"pink", coords: {lat: 6.4098, lng: 2.9676}},
		{id: 'alabama', zoom: 16, color:"pink", coords: {lat: 33.5167, lng: -86.8150}},
		{id: 'longisland', zoom: 16, color: "yellow", coords: {lat: 40.799774, lng: -73.3264033}},
		{id: 'ogunde', zoom: 10, color:"pink", coords: {lat: 7.8023, lng: 6.7333}},
		{id: 'huntington', zoom: 15, color: "yellow", coords: {lat: 40.8794658, lng: -73.4160849}}
	];

var location_divs = document.querySelectorAll(".location");
location_divs.forEach(function(div) {
	div.style.display = "none";
});

var slow_mode_button = document.querySelector("#slowmode");
slow_mode_button.addEventListener('click', function() {
	slow_mode_enabled = !slow_mode_enabled;
	slow_mode_button.classList.toggle('active');
	slow_mode_button.innerHTML = (slow_mode_enabled) ? "Slow Connection - ON" : "Slow Connection - OFF";
});

var default_div = document.querySelector("#default");

function initMap() {

	var options = {
		zoom: 2,
		center: {lat: 0.0000, lng: 11.0000}
	};

	var map = new google.maps.Map(document.getElementById("map"), options);

	var zoomout = document.querySelector("#zoomout");
	zoomout.addEventListener('click', function() {
		smoothZoomOut(map, 1, map.getZoom());
	});

	var marker;

	var icon = {
		url: "icons/saxophone.svg",
		scaledSize: new google.maps.Size(50,50),
		origin: new google.maps.Point(10,10),
		anchor: new google.maps.Point(0,0)
	};

	locations.map(function(location, index) {
		marker = new google.maps.Marker({
			position: location.coords, 
			map: map,
			icon: {
				url: `http://maps.google.com/mapfiles/ms/icons/${location.color}-dot.png`
			}
		});

		marker.addListener('click', (function(marker_inner) {
			return function() {

				map.panTo(marker_inner.getPosition());

				if (map.getZoom() < location.zoom) {
					smoothZoomIn(map, location.zoom, map.getZoom());
				} else {
					smoothZoomOut(map, location.zoom, map.getZoom());
				}

				default_div.style.display = "none";

				location_index = index;	

				showLocation(location.id);
			} 
		}) (marker));
	});

	var arrows = document.querySelectorAll(".arrow");

	arrows.forEach(function(arrow) {
		arrow.addEventListener('click', function(e) {
			default_div.style.display = "none";

			if (e.target.id == "right-arrow" || e.target.id == "right-arrow-1" || e.target.id == "right-arrow-2") {
				location_index = ((typeof location_index == "number") && location_index != locations.length - 1) 
								? location_index + 1 
								: 0;
			} else {
				location_index = ((typeof location_index == "number") && location_index != 0) 
								? location_index - 1 
								: locations.length - 1;
			}

			loc = locations[location_index];

			showLocation(loc.id);

			if (slow_mode_enabled) {
				map.panTo(loc.coords);
			    map.setZoom(loc.zoom);
			} else {
				current_zoom = map.getZoom();

				smoothZoomOut(map, 1, current_zoom);
			
				setTimeout(function(){
					map.panTo(loc.coords);
					setTimeout(function() {
						smoothZoomIn(map, loc.zoom, map.getZoom());
					}, 50 * current_zoom);
				}, 100 * map.getZoom());
			}
		});
	});

	var home_button = document.querySelector("#home");
	home_button.addEventListener('click', function(e) {
		if (e.target.classList[0] == "home") {
			location_divs.forEach(function(div) {
				div.style.display = "none";
			});

			default_div.style.display = "block";

			map.panTo(options.center);
			map.setZoom(2);

			location_index = false;
		}
	});
}

function showLocation(id) {
	location_divs.forEach(function(div) {
		div.style.display = "none";
	});

	var selected_div = document.querySelector(`#${id}`);
	selected_div.style.display = "block";
}

function smoothZoomIn (map, target, current) {
    if (current >= target) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoomIn(map, target, current + 1);
        });
        setTimeout(function(){map.setZoom(current)}, 80); 
    }
}  

function smoothZoomOut (map, target, current) {
	if (current <= target) {
		return;
	}
	else {
		z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
			google.maps.event.removeListener(z);
			smoothZoomOut(map, target, current - 1);
		});
		setTimeout(function() {map.setZoom(current)}, 50);
	}
}
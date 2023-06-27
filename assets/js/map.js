var home = {
	lat: 64.15,
	lng: 19.6,
	zoom: 11
}; 

var map = L.map('map', {
    // Set latitude and longitude of the map center (required)
    center: [home.lat, home.lng],
    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
    zoom: home.zoom
});


// Creating tile layers and adding one to the map it to the map
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	minZoom: 5,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);

var osm = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 5});

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
	minZoom: 5,
	subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
	maxZoom: 20,
	subdomains:['mt0','mt1','mt2','mt3']
});


////Creating styles for the geojson files

var catchmentsStyle = {
	weight:1,
    fillColor: "blue", //"#CCAA66",
    color: "black", //"#CCAA66",
    fillOpacity:0.05
}

var weirsStyle = {		
	shape: "circle",
	radius: 6,
	fillColor: "brown",
	fillOpacity: 0.8,
	color: "white",
	weight: 1
}


////Adding all geojson layers to the map
var catchments = L.geoJSON(Catchments, {
	style : catchmentsStyle, 
	onEachFeature: function (feature, layer){
		layer.bindTooltip(feature.properties.Name, {
			permanent: true,
			opacity: 1,
			direction: "right"
		});
	}
}).addTo(map)

var weirs = L.geoJSON(Weirs, {
	style : weirsStyle, 
	onEachFeature: function(feature, layer){
	var label = `<p class='popup_tag'>ID: ${feature.properties.ID}<p/>` + `<p class='popup_tag'>Site: ${feature.properties.Name}<p/>`

	layer.bindPopup(label,{maxWidth: "auto"})
	}
}).addTo(map)


//Adding the basemaps
var baseLayers = {
	"osm": osm,
	"Open Topo Map": openTopoMap,
	"Google terrain": googleTerrain,
	"Google satellite": googleSat
}


//defining the function radioClick which is used for onclick event in the html file
function radioClick(myRadio) {
var selectedRadio = myRadio.id;
if(selectedRadio=="osmRadio") baseLayers["osm"].addTo(map)
	else map.removeLayer(baseLayers["osm"])
		if(selectedRadio=="openTopoMapRadio") baseLayers["Open Topo Map"].addTo(map)
			else map.removeLayer(baseLayers["Open Topo Map"])
				if(selectedRadio=="googleTerrainRadio") baseLayers["Google terrain"].addTo(map)
					else map.removeLayer(baseLayers["Google terrain"])
						if(selectedRadio=="googleSatRadio") baseLayers["Google satellite"].addTo(map)
							else map.removeLayer(baseLayers["Google satellite"])
						}



/// Controlling what happens when the checkboxes are checked
var catchmentsCheck = document.getElementById("catchmentsCheck")
var weirsCheck = document.getElementById("weirsCheck")

catchmentsCheck.onclick = function(){
	if($(this).is(':checked')){
		catchments.addTo(map)
		weirs.bringToFront()
	}
	else{
		map.removeLayer(catchments)
	}
}


weirsCheck.onclick = function(){
	if($(this).is(':checked')) {
		weirs.addTo(map)
	}
	else {
		map.removeLayer(weirs)
	}
}




L.easyButton('<i class="fa fa-home fa-lg" title="Zoom to home"></i>',function(btn,map){
	map.setView([home.lat, home.lng], home.zoom);
  	//Responsive map...
  	$(window).on("resize", function () { $("#map").height($(window).height()-50); map.invalidateSize(); }).trigger("resize");
  },'Zoom To Home').addTo(map);

//Mouse move coordinates

map.on('mousemove', function(e){
    $("#coordinates").html(`Lat:${e.latlng.lat.toFixed(3)}, Long:${e.latlng.lng.toFixed(3)}`)
})
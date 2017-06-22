var map;
var markers = [];
var filters = {};
var arr = [];
var unique = [];
var json = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"About a Boy","coordinates":[-122.408421,37.789119],"location":"Powell from Bush and Sutter","filter":"About a Boy"},"properties":{"shower":true,"vault":false,"releaseyear":"2014","title":"About a Boy","prodcompany":"NBC Studios","director":"Mark J. Kunerth"}},{"geometry":{"type":"About a Boy","coordinates":[-122.464062,37.803907],"location":"Crissy Field","filter":"About a Boy"},"properties":{"shower":true,"vault":false,"releaseyear":"2014","title":"About a Boy","prodcompany":"NBC Studios","director":"Mark J. Kunerth"}},{"type":"Feature","geometry":{"type":"180","coordinates":[-122.389042,37.790493],"location":"Epic Roasthouse (399 Embarcadero)","filter":"180"},"properties":{"shower":false,"vault":true,"releaseyear":"2014","title":"180","prodcompany":"SPI Cinemas","director":"Jayendra"}},{"type":"Feature","geometry":{"type":"180","coordinates":[-122.410843,37.791842],"location":"Mason & California Streets (Nob Hill)","filter":"180"},"properties":{"shower":false,"vault":true,"releaseyear":"2011","title":"180","prodcompany":"SPI Cinemas","director":"Jayendra"}},{"type":"Feature","geometry":{"type":"180","coordinates":[-122.395201,37.795119],"location":"Justin Herman Plaza","filter":"180"},"properties":{"shower":false,"vault":true,"releaseyear":"2011","title":"180","prodcompany":"SPI Cinemas","director":"Jayendra"}}]};

$(function (){	
	$.each(json.features, function (key, value) {
		arr.push(value.geometry.filter);
		if(arr.length === json.features.length){
			unique = arr.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
		}
	});

    $('input#locationSelection').autocomplete({
		source: unique,
		select: function (e, elem) {
			filters = {shower:false, vault:false};
			$("#locationSelection").val(elem.item.label);
			var filter_name = $('#locationSelection').val() === 'About a Boy' ? 'shower': 'vault'; 
			map_filter(filter_name);
			filter_markers()
			return false;
		}
    });
});

function get_set_options(){
  ret_array = [];
  for (option in filters) {
    if (filters[option]) {
      ret_array.push(option);
    }
  }
  return ret_array;
}

function filter_markers(){  
  set_filters = get_set_options(); 
  for (i = 0; i < markers.length; i++) {
    marker = markers[i];
    keep=true;
    for (opt=0; opt<set_filters.length; opt++) {
      if (!marker.properties[set_filters[opt]]) {
        keep = false;
      }
    }
    marker.setVisible(keep);
  }
}

function map_filter(id_val){
   if (filters[id_val]) 
      filters[id_val] = false;
   else
      filters[id_val] = true;
}

function loadMarkers(){
	var infoWindow = new google.maps.InfoWindow();   
	data = json['features'];
	$.each(data, function(key, val) {
		var point = new google.maps.LatLng(parseFloat(val['geometry']['coordinates'][1]),parseFloat(val['geometry']['coordinates'][0]));
		var titleText = val['properties']['title'];
		var releaseyear = val['properties']['releaseyear'];
		var prodcompany = val['properties']['prodcompany'];
		var director = val['properties']['director'];
		var marker = new google.maps.Marker({
		  position: point,
		  title: titleText,
		  map: map,
		  properties: val['properties']
		});		
		var tooltipString = '<div><h4>Movie:&nbsp;'+ titleText + '</h4><h4>Release Year:&nbsp;'+releaseyear+'</h4><h5>Director:&nbsp;'+director+'</h5><span>Production:&nbsp;'+prodcompany+'</span></div>';
		var infowindow = new google.maps.InfoWindow({content: tooltipString});		
		marker.addListener('click', function() {
		   infowindow.open(map, this);
		});
		markers.push(marker);       
	});	
}
var center = new google.maps.LatLng(37.79866218, -122.4290657);
function initMap(){
    map_options = {  
		center: center,
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
    map_document = document.getElementById('map')
    map = new google.maps.Map(map_document,map_options);
    loadMarkers()
}
google.maps.event.addDomListener(window, 'load', initMap);
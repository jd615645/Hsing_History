function initMap() {
  var sheet_src = '1nDYnBptHmyxWQyxQb-5aiBJemoGYiKtqEeH18O6vjuE';
  var url = 'https://spreadsheets.google.com/feeds/list/' + sheet_src + '/1/public/values?alt=json';

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.121468, lng: 120.675867},
    zoom: 17
  });

  $.getJSON(url, function(data) {
    var input = data.feed.entry;
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 24.121468, lng: 120.675867},
      zoom: 17
    });
    var history_details = [];
    var last_marker;

    input.forEach(function(input_data, i){
      var lat = Number(input_data['gsx$lat']['$t']),
          lng = Number(input_data['gsx$lng']['$t']),
          name = input_data['gsx$name']['$t'],
          introduction = input_data['gsx$introduction']['$t'],
          detail = input_data['gsx$detail']['$t'],
          location = input_data['gsx$location']['$t'];
      markers.push(new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        animation: google.maps.Animation.DROP,
      }));
      history_details.push({
        name: name,
        introduction: introduction,
        detail: detail,
        location: location,
      });
    });

    markers.forEach(function(marker, i){
			marker.addListener('click', function() {
        if (marker.getAnimation() === null) {
          console.log(history_details[i]);
					marker.setAnimation(google.maps.Animation.BOUNCE);
					if (last_marker !== undefined) {
            markers[last_marker].setAnimation(null);
          }
					last_marker = i;
				}
        var contentString = '1';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        infowindow.open(map, marker);
			});
    });
	});
};

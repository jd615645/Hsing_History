jQuery(document).ready(function($) {
  var sheet_src = '1nDYnBptHmyxWQyxQb-5aiBJemoGYiKtqEeH18O6vjuE';
  var url = 'https://spreadsheets.google.com/feeds/list/' + sheet_src + '/1/public/values?alt=json';
  var map = L.map('map-canvas',
    {
      center: [24.121644, 120.673804],
      zoom: 17,
      zoomControl:false
    });

  var markers = [];

  window.history_details = [];
  var plan_place = [[4, 13, 11, 5, 15], [12, 8, 10, 9, 18], [1, 0, 2, 3, 17, 7]];
  var last_marker;
  var mapmarker = new L.FeatureGroup();

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  $.getJSON(url, function(data) {
    var input = data.feed.entry;
    var num = 0;

    input.forEach(function(input_data, i) {
      var lat = Number(input_data['gsx$lat']['$t']),
          lng = Number(input_data['gsx$lng']['$t']),
          name = input_data['gsx$name']['$t'],
          introduction = input_data['gsx$introduction']['$t'],
          detail = input_data['gsx$detail']['$t'],
          location = input_data['gsx$location']['$t'];
          img = input_data['gsx$img']['$t'].split('|');

      history_details.push({
        name: name,
        introduction: introduction,
        detail: detail,
        location: location,
        img: img
      });

      markers.push(
        L.marker([lat, lng], {opacity: 1})
         .on('click', function(e) {
            if (!this.isBouncing()) {
              this.bounce();
              if (last_marker !== undefined) {
                markers[last_marker].stopBouncing();
              }
            }

            // 紀錄最後當下點擊的marker
            last_marker = i;

            var content = history_details[i]['introduction'];
            if (content == '') {
              content = history_details[i]['detail'];
            }

            var win = L.control.window(map, {title:history_details[i]['name'], maxWidth:400, modal: true})
                       .content(content+ '<img src="' + history_details[i]['img'][0] + '.jpg">');
            $('.ui.dimmer').dimmer('show');
            $('.leaflet-control-window .content img').load(function() {
              win.show();
              $('.ui.dimmer').dimmer('hide');
            })
            clickZoom(e);
         })
      );
      mapmarker.addLayer(markers[num++]);
    });

    map.addLayer(mapmarker);
  });
  function clickZoom(e) {
    map.setView(e.target.getLatLng(),17);
  }
  $('.dimmer').dimmer({
    closable: false
  });
});

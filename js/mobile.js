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
         .on('click', function() {
           if (!this.isBouncing()) {
             this.bounce();
             if (last_marker !== undefined) {
               markers[last_marker].stopBouncing();
             }
           }
           // 紀錄最後當下點擊的marker
           last_marker = i;
           console.log(history_details[i]);
         })
      );
      mapmarker.addLayer(markers[num++]);
    });

    map.addLayer(mapmarker);
  });
  //
  // function clear_markers() {
  //   L.Marker.stopAllBouncingMarkers();
  //   markers.forEach(function(marker, i) {
  //     mapmarker.removeLayer(marker);
  //   });
  // }
  // function show_all_markers() {
  //   L.Marker.stopAllBouncingMarkers();
  //   markers.forEach(function(marker, i) {
  //     mapmarker.addLayer(marker);
  //   });
  // }
  // function show_markers(marker_place) {
  //   marker_place.forEach(function(key, val) {
  //     mapmarker.addLayer(markers[key]);
  //   });
  // }
  //
  // function change_pic(val) {
  //   var owl = $(".owl-carousel").data('owlCarousel');
  //   owl.goTo(0);
  //   $('.preview_img img').attr('src', history_details[val].img[0] + '.jpg');
  //
  //   (history_details[val].img).forEach(function(val, key) {
  //     if(val != '') {
  //       val = val+'.jpg';
  //       $('.owl-page:nth-child(' + (key+1) + ')').show();
  //       $('.owl-item:nth-child(' + (key+1) + ')').show();
  //     }
  //     else {
  //       val = '#';
  //       $('.owl-page:nth-child(' + (key+1) + ')').hide();
  //       $('.owl-item:nth-child(' + (key+1) + ')').hide();
  //     }
  //     $('.ui.modal #owl-slide img[value="' + key + '"]').attr('src', val);
  //   })
  //
  //   $('.preview_img').show();
  //   $('.loading').show();
  //   $('.preview_img img').hide();
  //   $('img').load(function() {
  //     $('.loading').hide();
  //     $('.preview_img img').show();
  //   });
  // }
  //
  // // 監聽點選路線目錄事件
  // $('#plan .button').click(function() {
  //   var val = $(this).attr('value');
  //   click_menu(val);
  //
  //   if (val == 1) {
  //     clear_markers();
  //     show_markers(plan_place[0]);
  //   }
  //   else if (val == 2) {
  //     clear_markers();
  //     show_markers(plan_place[1]);
  //   }
  //   else if (val == 3) {
  //     clear_markers();
  //     show_markers(plan_place[2]);
  //   }
  //   else if (val == 0) {
  //     // clear_all_line();
  //     clear_markers();
  //     show_all_markers();
  //   }
  // });
  //
  // // 點選不同路線目錄
  // function click_menu(val) {
  //   $('.preview_img').hide();
  //   $('#plan .button.clicked').removeClass('clicked');
  //   $('#plan .button[value=' + val + ']').addClass('clicked');
  //
  //   if (val == 0) {
  //     $('.plan_detail > div').hide();
  //     $('.plan_detail > div[value=0]').show();
  //   }
  //   else {
  //     $('.plan_detail > div').hide();
  //     $('.plan_detail > div[value=1]').show();
  //     showdetail(val);
  //   }
  // }
  //
  // function showdetail(plan) {
  //   var $detail = $('.plan_detail .accordion');
  //   $detail.empty();
  //   plan_place[plan-1].forEach(function(val) {
  //     var text = history_details[val].introduction;
  //     if (text == '') {
  //       text = history_details[val].detail;
  //     }
  //
  //     $detail.append('<div class="title" value="' + val + '"><i class="dropdown icon"></i>' + history_details[val].name + '</div><div class="content"><p class="transition hidden">' + text + '</p></div>');
  //   })
  // }
  //
  // $('.plan_detail').on('click', '.title', function() {
  //   var val = $(this).attr('value');
  //   click_name(val);
  //   change_pic(val);
  // });
  //
  // function click_name(val) {
  //   if (!markers[val].isBouncing()) {
  //     markers[val].bounce();
  //     if (last_marker !== undefined) {
  //       markers[last_marker].stopBouncing();
  //     }
  //   }
  //   last_marker = val;
  // }
  // $('.preview_img').dimmer({ on: 'hover' });
  //
  // $('.preview_img').click(function() {
  //   $('.ui.modal').modal('show');
  // });
  // $('.ui.modal i.close').click(function() {
  //   $('.ui.modal').modal('hide');
  // });
  // $('.preview_img').hide();
});

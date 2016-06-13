jQuery(document).ready(function($) {
  var sheet_src = '1nDYnBptHmyxWQyxQb-5aiBJemoGYiKtqEeH18O6vjuE';
  var url = 'https://spreadsheets.google.com/feeds/list/' + sheet_src + '/1/public/values?alt=json';
  var map = L.map('map-canvas').setView([24.121468, 120.675867], 17);

  // var markers = [];
  window.markers = [];
  var history_details = [];
  var plan_place = [[4, 6, 10, 0, 1], [1, 2, 3, 0, 5], [4, 6, 10, 0, 1]];
  var last_marker;

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  $.getJSON(url, function(data) {
    var input = data.feed.entry;

    input.forEach(function(input_data, i) {
      var lat = Number(input_data['gsx$lat']['$t']),
          lng = Number(input_data['gsx$lng']['$t']),
          name = input_data['gsx$name']['$t'],
          introduction = input_data['gsx$introduction']['$t'],
          detail = input_data['gsx$detail']['$t'],
          location = input_data['gsx$location']['$t'];
          img = input_data['gsx$img']['$t'];
      
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
           var value = $('#plan .menu .item.active').attr('value');
           if (!this.isBouncing()) {
             this.bounce();
             if (last_marker !== undefined) {
               markers[last_marker].stopBouncing();
             }
           }
           // 紀錄最後當下點擊的marker
           last_marker = i;
           // 更改導覽照片
           change_pic(i);
           if (value == 0) {
             $('#plan_name').text(history_details[i].name);
             if (history_details[i].introduction != '') {
               $('#plan-introduction').text(history_details[i].introduction);
             }
             else {
               $('#plan-introduction').text(history_details[i].detail);
             }
           }
           else {
             $('.plan_detail > div[value=' + value + '] .title[value=' + i + ']').click();
           }
         })
         .addTo(map)
      );
      $('#plan .menu .item:first').click();
      $('.ui.accordion').accordion();
    });

    // markers.forEach(function(marker, i) {
    //   marker.on('click', function() {
    //     var value = $('#plan .menu .item.active').attr('value');
    //     if (!this.isBouncing()) {
    //       marker.bounce();
    //       if (last_marker !== undefined) {
    //         markers[last_marker].stopBouncing();
    //       }
    //     }
    //     // 紀錄最後當下點擊的marker
    //     last_marker = i;
    //     // 更改導覽照片
    //     change_pic(i);
    //     if (value == 0) {
    //       $('#plan_name').text(history_details[i].name);
    //       if (history_details[i].introduction != '') {
    //         $('#plan-introduction').text(history_details[i].introduction);
    //       }
    //       else {
    //         $('#plan-introduction').text(history_details[i].detail);
    //       }
    //     }
    //     else {
    //       $('.plan_detail > div[value=' + value + '] .title[value=' + i + ']').click();
    //     }
    //   })
    // });
  });

  function clear_markers() {
    markers.forEach(function(marker, i) {
      if (marker.isBouncing()) {
        marker.stopBouncing();
      }
      marker.setOpacity(0);
    });
    // for (var i = 0; i < markers.length; i++) {
    //   if (markers[i].isBouncing()) {
    //     markers[i].stopBouncing();
    //   }
    //   markers[i].setOpacity(0);
    // }
  }

  function show_all_markers() {
    clear_markers();
    markers.forEach(function(marker, i) {
      if (marker.isBouncing()) {
        marker.stopBouncing();
      }
      marker.setOpacity(1);
    });
  }

  function show_markers(marker_place) {
    clear_markers();
    marker_place.forEach(function(val, key) {
      if (markers[val].isBouncing()) {
        markers[val].stopBouncing();
      }
      markers[val].setOpacity(1);
    });
  }

  function change_pic(val) {
    $('.preview_img').show();
    $('.preview_img img').attr('src', history_details[val].img + '.jpg');
    $('.ui.modal img').attr('src', history_details[val].img + '.jpg');
  }

  var planA = [L.polyline([[24.123328,120.675033],[24.122604,120.675016]], { color: 'red' }),
               L.polyline([[24.122604,120.675016],[24.122643,120.673606]], { color: 'red' }) ];
  planA = L.layerGroup(planA);
  var planB = [L.polyline([[24.122578,120.673494],[24.123263,120.675744]], { color: 'red' })];
  planB = L.layerGroup(planB);
  var planC = [L.polyline([[24.122578,120.673494],[24.123263,120.675]], { color: 'red' })];
  planC = L.layerGroup(planC);
  
  // 監聽點選路線目錄事件
  $('#plan .menu .item').click(function() {
    var val = $(this).attr('value');
    click_menu(val);

    if (val == 1) {
      clear_markers();
      draw_plan('A');
      show_markers(plan_place[0]);
    }
    else if (val == 2) {
      draw_plan('B');
      show_markers(plan_place[1]);
    }
    else if (val == 3) {
      draw_plan('C');
      show_markers(plan_place[2]);
    }
    else if (val == 0) {
      clear_all_line();
      show_all_markers();
    }
  });

  // 點選不同路線目錄
  function click_menu(val) {
    $('.preview_img').hide();
    $('#plan .menu .item.active').removeClass('active');
    $('#plan .menu .item[value=' + val + ']').addClass('active');

    $('.plan_detail > div').hide();
    $('.plan_detail > div[value=' + val + ']').show();
  }

  // var polylineArray = [
  //   L.polyline([[24.123328,120.675033],[24.122604,120.675016]], { color: 'red' }),
  //   L.polyline([[24.122604,120.675016],[24.122643,120.673606]], { color: 'red' })
  // ];

  // var polylines = L.layerGroup(polylineArray);

  // // Add all polylines to the map
  // polylines.addTo(map);


  function draw_plan(which) {
    clear_all_line();
    switch (which) {
      case 'A':
        planA.addTo(map);
        break;
      case 'B':
        planB.addTo(map);
        break;
      case 'C':
        planC.addTo(map);
        break;
    }
  }
  function clear_all_line() {
    map.removeLayer(planA);
    map.removeLayer(planB);
    map.removeLayer(planC);
  }
  
  $('.plan_detail .title').click(function(){
    var val = $(this).attr('value');
    click_name(val);
    change_pic(val);
  });
  function click_name(val) {
    if (!markers[val].isBouncing()) {
      markers[val].bounce();
      if (last_marker !== undefined) {
        markers[last_marker].stopBouncing();
      }
    }
    last_marker = val;
  }

  $('.preview_img img').click(function() {
    $('.ui.modal').modal('show');
  });
  $('.ui.modal i.close').click(function() {
    $('.ui.modal').modal('hide');
  });
  $('.preview_img').hide();
});
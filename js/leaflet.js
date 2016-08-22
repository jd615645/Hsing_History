jQuery(document).ready(function($) {
  var sheet_src = '1nDYnBptHmyxWQyxQb-5aiBJemoGYiKtqEeH18O6vjuE';
  var url = 'https://spreadsheets.google.com/feeds/list/' + sheet_src + '/1/public/values?alt=json';
  var map = L.map('map-canvas').setView([24.121468, 120.675867], 17);

  var markers = [];

  window.history_details = [];
  var plan_place = [[4, 13, 11, 5, 15], [12, 8, 10, 9, 18], [1, 0, 2, 3, 17, 7]];
  var last_marker;
  var mapmarker = new L.FeatureGroup();

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var info = L.control({'position': 'bottomleft'});

  info.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    div.innerHTML = '<div class="preview_img"><img src="#"><div class="loading"><div class="ui active centered inline loader"></div></div><div class="ui dimmer"><div class="content"><div class="center"><i class="zoom icon"></i></div></div></div></div>';
    return div;
  };
  info.addTo(map);

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
           var value = $('#plan .button.clicked').attr('value');
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
             $('.ui.accordion .title[value="' + i + '"]').accordion('open');
           }

         })
      );
      mapmarker.addLayer(markers[num++]);
    });

    map.addLayer(mapmarker);

    $('#plan .button:first').click();
    $('.ui.accordion').accordion();
  });

  function clear_markers() {
    L.Marker.stopAllBouncingMarkers();
    markers.forEach(function(marker, i) {
      mapmarker.removeLayer(marker);
    });
  }
  function show_all_markers() {
    L.Marker.stopAllBouncingMarkers();
    markers.forEach(function(marker, i) {
      mapmarker.addLayer(marker);
    });
  }
  function show_markers(marker_place) {
    marker_place.forEach(function(key, val) {
      mapmarker.addLayer(markers[key]);
    });
  }

  function change_pic(val) {
    $('.preview_img img').attr('src', history_details[val].img[0] + '.jpg');

    // $('.ui.modal img').attr('src', history_details[val].img[0] + '.jpg');
    // $('.ui.modal #owl-slide').empty();

    (history_details[val].img).forEach(function(val, key) {
      var imgSrc = (val != '' ? val+'.jpg' : '#');
      $('.ui.modal #owl-slide img[value="' + key + '"]').attr('src', imgSrc);
    })

    $('.preview_img').show();
    $('.loading').show();
    $('.preview_img img').hide();
    $('img').load(function() {
      $('.loading').hide();
      $('.preview_img img').show();
    });
  }

  // 監聽點選路線目錄事件
  $('#plan .button').click(function() {
    var val = $(this).attr('value');
    click_menu(val);

    if (val == 1) {
      clear_markers();
      show_markers(plan_place[0]);
    }
    else if (val == 2) {
      clear_markers();
      show_markers(plan_place[1]);
    }
    else if (val == 3) {
      clear_markers();
      show_markers(plan_place[2]);
    }
    else if (val == 0) {
      // clear_all_line();
      clear_markers();
      show_all_markers();
    }
  });

  // 點選不同路線目錄
  function click_menu(val) {
    $('.preview_img').hide();
    $('#plan .button.clicked').removeClass('clicked');
    $('#plan .button[value=' + val + ']').addClass('clicked');

    if (val == 0) {
      $('.plan_detail > div').hide();
      $('.plan_detail > div[value=0]').show();
    }
    else {
      $('.plan_detail > div').hide();
      $('.plan_detail > div[value=1]').show();
      showdetail(val);
    }
  }

  function showdetail(plan) {
    var $detail = $('.plan_detail .accordion');
    $detail.empty();
    plan_place[plan-1].forEach(function(val) {
      var text = history_details[val].introduction;
      if (text == '') {
        text = history_details[val].detail;
      }

      $detail.append('<div class="title" value="' + val + '"><i class="dropdown icon"></i>' + history_details[val].name + '</div><div class="content"><p class="transition hidden">' + text + '</p></div>');
    })
  }

  $('.plan_detail').on('click', '.title', function() {
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
  $('.preview_img').dimmer({ on: 'hover' });

  $('.preview_img').click(function() {
    $('.ui.modal').modal('show');
  });
  $('.ui.modal i.close').click(function() {
    $('.ui.modal').modal('hide');
  });
  $('.preview_img').hide();
});

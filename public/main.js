var socket = io.connect("http://localhost:5000", {
  'forceNew': true
});

function editName() {
  var source = event.target || event.srcElement;
  alert($(source).parent().html())
}

function changeType(e) {
  var e = window.event || e;
  var source = e.target || e.srcElement

  if ($(source).attr('class').indexOf("unknown") >= 0) {
    $(source).attr('class', "fas fa-shield-alt known")
  } else {
    $(source).attr('class', "fa fa-question unknown")
  }
}

function doPing(mac) {
  ip = $("#devices_tr_"+mac).children().eq(1).html();
  var settings = {
    "async": true,
    "url": "/ping",
    "method": "GET",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "ip": ip
    }
  }
  $.ajax(settings).done(function(response) {
    $('#ping_ip').html(response.ip)
    $('#ping_min').html(response.min)
    $('#ping_max').html(response.max)
    $('#ping_avg').html(response.avg)
    $('#modal-ping').modal('show')
    $("#devices_tr_"+mac+" td button i").attr("class", "fas fa-caret-down")
  });

  $("#devices_tr_"+mac+" td button i").attr("class", "fas fa-spinner fa-refresh fa-spin")
}


$(document).ready(function() {
  $('#device').editable();
  $('#modal-ping').modal('hide')
});

var socket = io.connect("http://localhost:5000", {
  'forceNew': true
});

socket.on('disconnected_devices', function(data) {
  data.forEach(function(mac) {
    $("tr[id='devices_tr_" + mac + "']").remove();
  })

});

socket.on('connected_devices', function(data) {
  data.forEach(function(device) {
    var str = `<tr id='devices_tr_${device.mac}'>
        <td><a href="#" class="device_name" data-type="text" data-title="Nombre del dispositivo">${device.vendor}</a></td>
        <td>${device.ip}</td>
        <td>${device.mac}</td>
        <td>
        </td>
        <td>
          <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fas fa-caret-down"></i></button>
            <ul class="dropdown-menu">
              <li><a onclick="doPing('${device.ip}')">Ping</a></li>
              <li><a onclick="register('${device.mac}')"> Guardar</a></li>
            </ul>
          </div>
        </td>
      </tr>`
    $("#connected-devices").append(str)
  })

});


function changeType(e) {
  var e = window.event || e;
  var source = e.target || e.srcElement

  if ($(source).attr('class').indexOf("unknown") >= 0) {
    $(source).attr('class', "fas fa-shield-alt known")
  } else {
    $(source).attr('class', "fa fa-question unknown")
  }
}


function register(mac) {
  device = {
    ip: $("#devices_tr_" + mac).children().eq(1).html(),
    mac: $("#devices_tr_" + mac).children().eq(2).html(),
    vendor: $("#devices_tr_" + mac).children().eq(0).html()
  }
  var settings = {
    "async": true,
    "url": "/register",
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": device
  }

  $.ajax(settings).done(function(response) {
    console.log(response)
  });


}

function doPing(ip) {
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
    //$("#devices_tr_" + mac + " td button i").attr("class", "fas fa-caret-down")
  });

  //$("#devices_tr_" + mac + " td button i").attr("class", "fas fa-spinner fa-refresh fa-spin")
}


$(document).ready(function() {
  $('.device_name').editable();
  $('#modal-ping').modal('hide')
});

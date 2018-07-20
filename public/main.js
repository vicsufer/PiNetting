var socket = io.connect("http://192.168.0.2:5000", {
  'forceNew': true
});

socket.on('disconnected_devices', function(data) {
  data.forEach(function(mac) {
    //Remove device from connected devices table
    $("#connected-devices tr[id='devices_tr_" + mac + "']").remove();
    //If it is regiseres set the switch off and delete the IP
    $("#registered-devices tr[id='devices_tr_" + mac + "'] input").prop('checked', false)
    $("#registered-devices tr[id='devices_tr_" + mac + "'] td").eq(1).html("")
  })

});

socket.on('connected_devices', function(data) {
  data.forEach(function(device) {
    //Create HTML code for new connected device
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
              <li><a onclick="register('${device.mac}','${device.vendor}')"> Guardar</a></li>
            </ul>
          </div>
        </td>
      </tr>`
    $("#connected-devices").append(str)
    //If the device is registered set the switch on and the IP
    $("#registered-devices tr[id='devices_tr_" + device.mac + "'] input").prop('checked', true)
    $("#registered-devices tr[id='devices_tr_" + device.mac + "'] td").eq(1).html( device.ip )
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


function register(mac, vendor) {
  $.ajax({
    url: '/register',
    type: "POST",
    data: {
      mac: mac,
      vendor: vendor
    },
    success: function(result) {
      console.log(result);
    },
    error: function(xhr, resp, text) {
      console.log(xhr, resp, text);
    }
  })
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

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
    var faicon = ($("#registered-devices tr[id='devices_tr_" + device.mac + "']").length > 0 ? "<i class='fas fa-shield-alt'></i>" : "<i class='fas fa-exclamation-triangle'></i>")
    var str = `<tr id='devices_tr_${device.mac}'>
        <td><a href="#" class="device_name" data-type="text" data-title="Nombre del dispositivo">${device.vendor}</a></td>
        <td>${device.ip}</td>
        <td>${device.mac}</td>
        <td>${faicon}</td>
        <td>
          <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fas fa-caret-down"></i></button>
            <ul class="dropdown-menu">
              <li><a onclick="doPing('${device.ip}')">Ping</a></li>
              <li><a onclick="register('${device.mac}','${device.ip}','${device.vendor}')"> Guardar</a></li>
            </ul>
          </div>
        </td>
      </tr>`
    $("#connected-devices").append(str);
    //If the device is registered set the switch on and the IP
    $("#registered-devices tr[id='devices_tr_" + device.mac + "'] input").prop('checked', true);
    $("#registered-devices tr[id='devices_tr_" + device.mac + "'] td").eq(1).html(device.ip);
  })

});


function switch_device(mac) {
  var ip = $("#registered-devices tr[id='devices_tr_" + mac + "'] td").eq(1).html()

  if ($("#registered-devices tr[id='devices_tr_" + mac + "'] input[type='checkbox']").is(':checked')) {
    $('#fip').val(ip)
    $('#fip').val(mac)
    $('#modal-shutdown').modal('show')
  } else {
    wakeup(mac)
  }
}

function register(mac, ip, vendor) {
  $.ajax({
    url: '/register',
    type: "POST",
    data: {
      mac: mac,
      vendor: vendor
    },
    success: function(result) {
      //Add registered device to table of registered devices
      var str = `<tr id='devices_tr_${mac}'>
        <td><a href="#" data-pk="${mac}" class="device_name" data-type="text" data-url="/rename" data-title="Nombre del dispositivo">${vendor}</a></td>
        <td>${ip}</td>
        <td>${mac}</td>
        <td>
          <label class="switch">
            <input type="checkbox" onclick="switch('${mac}','${ip}')">
            <span class="slider round"></span>
          </label>
        </td>
      </tr>`
      $("#registered-devices").append(str)
      //Set the switch on
      $("#registered-devices tr[id='devices_tr_" + mac + "'] input").prop('checked', true)
      //Add safe icon to connected devices table
      $("#connected-devices tr[id='devices_tr_" + mac + "'] rd").eq(3).html("<i class='fas fa-shield-alt'></i>")
    },
    error: function(xhr, resp, text) {
      console.log(xhr, resp, text);
    }
  })
}

function unregister(mac) {
  $.ajax({
    url: '/unregister',
    type: "DELETE",
    data: {
      mac: mac
    },
    success: function(result) {
      //Remove from registered devices table.
      $("#registered-devices tr[id='devices_tr_" + mac + "']").remove()
      //If it is connected change icon to unknown
      $("#connected-devices tr[id='devices_tr_" + mac + "'] rd").eq(3).html("<i class='fas fa-exclamation-triangle'></i>")
    },
    error: function(xhr, resp, text) {
      console.log(xhr, resp, text);
    }
  })
}

function doPing(ip) {
  //Setup loading icon.
  $("#devices_tr_" + mac + " td button i").attr("class", "fas fa-spinner fa-refresh fa-spin")

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
    //Set modal data.
    $('#ping_ip').html(response.ip)
    $('#ping_min').html(response.min)
    $('#ping_max').html(response.max)
    $('#ping_avg').html(response.avg)
    $('#modal-ping').modal('show')
    $("#devices_tr_" + mac + " td button i").attr("class", "fas fa-caret-down")
  });

}

function wakeup(mac) {
  $.ajax({
    url: '/wakeup',
    type: "GET",
    data: {
      mac: mac
    },
    success: function(result) {
      //Set the switch on
      $("#registered-devices tr[id='devices_tr_" + mac + "'] input").prop('checked', true)
      //Disable it for 10s
      $("#registered-devices tr[id='devices_tr_" + mac + "'] input").prop('enabled', false)
      setTimeout(function() {
        $("#registered-devices tr[id='devices_tr_" + mac + "'] input").prop('enabled', true)
      }, 10000)
    },
    error: function(xhr, resp, text) {
      console.log(xhr, resp, text);
    }
  })
}

function shutdown() {
  $.ajax({
    url: '/shutdown',
    type: "GET",
    data: {
      ip: $('#fip').val(),
      username: $('#fusername').val(),
      password: $('#fpassword').val()
    },
    success: function(result) {
      //Set the switch off
      $("#registered-devices tr[id='devices_tr_" + $('#fmac').val() + "'] input").prop('checked', false)
      //Disable it for 10s
      $("#registered-devices tr[id='devices_tr_" + $('#fmac').val() + "'] input").prop('enabled', false)
      setTimeout(function() {
        $("#registered-devices tr[id='devices_tr_" + $('#fmac').val() + "'] input").prop('enabled', true)
      }, 10000)
    },
    error: function(xhr, resp, text) {
      console.log(xhr, resp, text);
    }
  })
}

$(document).ready(function() {
  $('.device_name').editable();
  $('#modal-ping').modal('hide')
  $('#modal-shutdown').modal('hide')
  $('#form-shutdown').on('submit', function(e) {
    e.preventDefault();
    $('#modal-shutdown').modal('hide')
    shutdown();
  });
});

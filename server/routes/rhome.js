module.exports = function(app, gestorBD) {

  //GET
  app.get('/', function(req, res) {

    gestorBD.getRegisteredDevices({}, function(err, registered_devices) {
      if (err) {
        res.render('main', {
          devices: app.get("devices"),
          registered_devices: []
        });
      } else {
        res.render('main', {
          devices: app.get("devices"),
          registered_devices: registered_devices
        });
      }
    })

  });

  //POST
  app.post('/register', function(req, res) {
    console.log(req)
    console.log(req.body)
    device = {
      name: req.body.vendor,
      mac: req.body.mac,
    }

    gestorBD.registerDevice(device, function(err, result) {
      if (err) {
        res.status(500)
        res.send({
          message: "Unable to register"
        })
      } else {
        res.status(200)
        res.send({
          message: "OK"
        })
      }
    })

  });

  //POST
  app.post('/rename', function(req, res) {
    device = {
      name: req.body.name,
      mac: req.body.pk
    }
    res.status(200)
    res.send({
      message: "OK"
    })
  });

}

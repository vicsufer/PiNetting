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

  //POSt
  app.post('/register', function(req, res) {
    device = {
      name: req.body.vendor,
      ip: req.body.ip,
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

}

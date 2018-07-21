module.exports = function(app, gestorBD, logger) {

  //GET
  app.get('/', function(req, res) {
    var host = `${process.env.npm_package_config_hostip}:${process.env.npm_package_config_port}`
    gestorBD.getRegisteredDevices({}, function(err, registered_devices) {
      if (err) {
        res.render('main', {
          registered_devices: [],
          hostaddress: host
        });
      } else {
        res.render('main', {
          registered_devices: registered_devices,
          hostaddress: host
        });
      }
    })

  });

  //POST
  app.post('/register', function(req, res) {
    device = {
      name: req.body.vendor,
      mac: req.body.mac,
    }

    logger.log({
      level: 'verbose',
      label: 'Register',
      message: 'Registration request for ' + req.body.mac
    });

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

    logger.log({
      level: 'verbose',
      label: 'Rename',
      message: 'Renaming request for ' + req.body.pk + " to " + req.body.value
    });

    gestorBD.updateRegisteredDevice({
      mac: req.body.pk
    }, {
      $set: {
        name: req.body.value
      }
    }, function(err, response) {
      if (err) {
        res.status(500)
        res.send({
          message: "Can't update name"
        })
      } else {
        res.status(200)
        res.send({
          message: "OK"
        })
      }
    })

  });

  //DELETE
  app.delete('/unregister', function(req, res) {
    logger.log({
      level: 'verbose',
      label: 'Unregister',
      message: 'Unregister request for ' + req.body.mac
    });

    device = {
      mac: req.body.mac,
    }
    gestorBD.unregisterDevice(device, function(err, result) {
      if (err) {
        res.status(500)
        res.send({
          message: "Unable to unregister"
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

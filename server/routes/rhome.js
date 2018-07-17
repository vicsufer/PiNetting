module.exports = function(app, swig) {

  //GET
  app.get('/', function(req, res) {
    res.render('main', {
      devices: app.get("devices")
    });
  });

  //GET
  app.post('/register', function(req, res) {

    device={
      name:req.body.vendor,
      ip: req.body.ip,
      mac: req.body.mac,
    }
    var collection = db.collection("registered_devices");
    collection.insert(device);
    res.send({state:'ok'})
  });

}

module.exports = function(app, swig) {

  //GET
  app.get('/', function(req, res) {
    var respuesta = swig.renderFile('server/views/main.html', {
      devices: [{
          name: "Check",
          ip: "127.0.0.1",
          mac: "00-14-22-01-23-45",
          known: true
        },
        {
          name: "Check 2",
          ip: "192.168.0.100",
          mac: "02-80-22-04-31-79",
          known: false
        }
      ]
    });
    res.send(respuesta);
  });

}

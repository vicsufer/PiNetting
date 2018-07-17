module.exports = function(app, exec) {

  //GET
  app.get('/ping', function(req, res) {
    if (validateIPAddress(req.query.ip)) {
      var command = "ping -c 4 " + req.query.ip
      var dir = exec(command, function(err, stdout, stderr) {
        if (err) {
          res.status(500);
          res.send()
        } else {
          stdout = stdout.split("\n");
          summary = stdout[8];
          console.log(summary)
          values = summary.split(" ")[3].split("/");
          output = {
            ip: req.query.ip,
            min: values[0],
            avg: values[1],
            max: values[2]
          }
          res.status(200)
          res.send(output)
        }
      });
    } else {
      res.status(422);
      res.send({
        message: "Invalid IP address format"
      })
    }
  });
  
  //Utils
  function validateIPAddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }
    return (false)
  }
}

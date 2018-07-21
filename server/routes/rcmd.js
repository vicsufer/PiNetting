module.exports = function(app, child_process, io, gestorBD) {

  //GET
  app.get('/ping', function(req, res) {
    if (validateIPAddress(req.query.ip)) {
      var command = "ping -c 4 " + req.query.ip
      var dir = child_process.exec(command, function(err, stdout, stderr) {
        if (err) {
          res.status(500);
          res.send()
        } else {
          stdout = stdout.split("\n");
          summary = stdout[8];
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

  app.get('/wakeup', function(req, res) {
    var command = "wakeonlan -i 192.168.0.255 " + req.query.mac
    var dir = child_process.exec(command, function(err, stdout, stderr) {
      if (err) {
        res.status(500);
        res.send()
      } else {
        res.status(200);
        res.send({
          message: "OK"
        });
      }
    });

  });

  app.get('/shutdown', function(req, res) {
    if (validateIPAddress(req.query.ip)) {
      var command = `sudo net rpc -S ${req.query.ip} -U ${req.query.username}%${req.query.password} shutdown -t 1 -f`
      var dir = child_process.exec(command, function(err, stdout, stderr) {
        if (err) {
          console.log(err)
          res.status(500);
          res.send()
        } else {
          res.status(200);
          res.send({
            message: "OK"
          });
        }
      });
    } else {
      res.status(422);
      res.send({
        message: "Invalid data"
      })
    }
  });

  //Perform discovery scan, time slices are specified in environmental variables.
  setInterval(function() {
    //Launch nmap
    var command = "sudo nmap -sP -PR -n --max-retries 4 192.168.0.1/24"// + process.env.npm_package_config_iprange
    var dir = child_process.exec(command, function(err, stdout, stderr) {
      //Get output and parse
      stdout = stdout.split("\n") //Split output in lines.
      stdout = stdout.filter(x => x != "") //Remove useless lines.
      stdout.shift() //Remove header
      stdout.pop() //Remove summary
      stdout = chunkArray(stdout, 3); //Information for each device has three lines
      stdout.pop() //Last one is localhost, we don't need that one.
      var devices = []
      stdout.forEach(function(dev) {
        //Parse each device and add it to the list.
        var device = {
          ip: dev[0].split("Nmap scan report for ")[1],
          mac: dev[2].split("MAC Address: ")[1].split(" ", 1)[0],
          vendor: dev[2].split("MAC Address: ")[1].split(" ", 2)[1].replace("(", "").replace(")", "")
        }
        devices.push(device);
      });
      //Get connected devices
      //Compare mac first then retrieve whole object
      let connected = devices.map(x => x.mac).filter(x => !app.get("devices").map(y => y.mac).includes(x));
      connected = devices.filter(x => connected.includes(x.mac))
      //Get disconnected devices (Only MAC is needed)
      let disconnected_mac = app.get("devices").map(x => x.mac).filter(x => !devices.map(y => y.mac).includes(x));

      //If any changes report them to the sockets.
      if (connected != [])
        io.sockets.emit('connected_devices', connected);
      if (disconnected_mac != [])
        io.sockets.emit('disconnected_devices', disconnected_mac);
      //Set device in this scan as the current connected in the whole app.
      app.set("devices", devices)

      if (stderr) {
        console.log('exec error: ' + stderr);
      }
    });

  }, process.env.npm_pinneting_config_scanfrequency);

  //Utils
  function validateIPAddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }
    return (false)
  }

  function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index + chunk_size);
      tempArray.push(myChunk);
    }
    return tempArray;
  }

}

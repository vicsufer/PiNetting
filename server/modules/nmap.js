setInterval(function() {
  var command = "sudo nmap -sP -PR -n --max-retries 4 192.168.0.1/24"
  var dir = child_process.exec(command, function(err, stdout, stderr) {

    stdout = stdout.split("\n")
    stdout.shift() //Remove header of the output
    stdout.shift() //Remove header of the output
    stdout.pop() //Remove summary
    stdout.pop() //Remove summary
    stdout = chunkArray(stdout, 3);
    //Last one is localhost, we don't need that one.
    stdout.pop()
    var devices = []
    stdout.forEach(function(dev) {

      var device = {
        ip: dev[0].split("Nmap scan report for ")[1],
        mac: dev[2].split("MAC Address: ")[1].split(" ", 1)[0],
        vendor: dev[2].split("MAC Address: ")[1].split(" ", 2)[1].replace("(", "").replace(")", "")
      }

      devices.push(device);
    });

    //Get disconnected devices

    //Compare mac first then retrieve whole object
    let connected = devices.map(x => x.mac).filter(x => !app.get("devices").map(y => y.mac).includes(x));
    connected = devices.filter(x => connected.includes(x.mac))

    let disconnected_mac = app.get("devices").map(x => x.mac).filter(x => !devices.map(y => y.mac).includes(x));

    if (connected != [])
      io.sockets.emit('connected_devices', connected);
    if (disconnected_mac != [])
      io.sockets.emit('disconnected_devices', disconnected_mac);

    app.set("devices", devices)
    if (stderr) {
      console.log('exec error: ' + stderr);
    }
  });
}, 4000);

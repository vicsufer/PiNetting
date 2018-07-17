var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const winston = require('winston');
var engine = require('express-dot-engine');
var path = require('path');



var sys = require('util')
var exec = require('child_process').exec;

//Winston logger
const winstonLog = require("./modules/logger.js")
winstonLog.init(winston);
const logger = winstonLog.logger;

require("./routes/rhome.js")(app);
require("./routes/rcmd.js")(app, exec);
/*
//Network tools
const nmap = require('libnmap');
const opts = {
  range: [
    '192.168.0.0/25',
  ]
};


nmap.scan(opts, function(err, report) {
  console.log("hola")
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(report[item])
    //console.log(JSON.stringify(report[item]));
  }
});
*/

//Variables
app.set('port', 5000);

app.use(express.static('public'));
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');

app.get('/', function(req, res) {

  res.render('main', {
    devices: [{
        vendor: "Samsung Electronics",
        name: "Check",
        ip: "127.0.0.1",
        mac: "00-14-22-01-23-45",
        known: true
      },
      {
        vendor: "Sony",
        name: "Check 2",
        ip: "192.168.0.100",
        mac: "02-80-22-04-31-79",
        known: false
      }
    ]
  });
});

/*
IMRPOVEMENT FOT LINUX -> https://stackoverflow.com/questions/24433580/device-computer-discovery-in-my-network
*/

function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }
  return tempArray;
}

/*
setInterval(function() {
  var command = "nmap -sP -PR 192.168.0.1/17"
  var dir = exec(command, function(err, stdout, stderr) {
    stdout = stdout.split("\n")
    stdout.shift() //Remove header of the output
    stdout.pop() //Remove summary
    stdout = chunkArray(stdout, 3);
    var devices = []
    console.log(JSON.stringify(stdout, null, 2))

    stdout.forEach(function(dev) {
      var device = {
        ip: dev[0].split("Nmap scan report for ")[1],
        mac: dev[2].split("MAC Address: ")[1]
      }
      devices.push(device)
    });
    console.log(JSON.stringify(devices, null, 2))
    if (stderr) {
      console.log('exec error: ' + stderr);
    }
  });
}, 5000);
*/


/*
//Elasticserach
var elastic = require('./modules/elasticsearch.js');
if (!elastic.indexExists()) {
  elastic.initIndex();
  elastic.initMapping();
}

elastic.initMapping(function(err, resp, status) {
  if (err) {
    console.log(err);
  } else {
    console.log(resp);
  }
})

devices = []
setInterval(function() {
  local().then(found_devices => {

    found_devices.forEach(function(device) {
      //If device is not in the list log the new connection.
      if( devices.map(x=>x.mac).indexOf(device.mac) <0 )
      {
        logger.transports[2].silent = false
        logger.log({
          level: 'verbose',
          label: 'CONNECTION',
          message: JSON.stringify(device)
        });
        logger.transports['2'].silent = true // turns off
        devices.push(device);
      }
    });
    //console.log(devices.map(x=>x.mac))
    //console.log(found_devices.map(x=>x.mac))
    //Get difference of new and current devices
    disconnected = devices.filter( dev => found_devices.map(x=>x.mac).indexOf(dev.mac) < 0 );
    console.log(disconnected)
    disconnected.forEach(function(device) {
      logger.transports[2].silent = false
      logger.log({
        level: 'verbose',
        label: 'DISCONNECTION',
        message: JSON.stringify(device)
      });
      logger.transports['2'].silent = true // turns off
    });

    devices = found_devices
  });
  /*
  [
    { name: '?', ip: '192.168.0.10', mac: '...' },
    { name: '...', ip: '192.168.0.17', mac: '...' },
    { name: '...', ip: '192.168.0.21', mac: '...' },
    { name: '...', ip: '192.168.0.22', mac: '...' }
  ]


}, 500);
*/

http.listen(app.get('port'), function() {
  logger.log({
    level: 'verbose',
    label: 'Bootstrap',
    message: 'Server started at ' + app.get('port')
  });
});

io.on('connection', function(socket) {

  logger.log({
    level: "verbose",
    label: 'Connection',
    message: 'User connected to socket'
  });

});

var express = require('express');
var app = express();
var fs = require('fs')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const winston = require('winston');
var swig = require('swig');

//Winston logger
const winstonLog = require("./modules/logger.js")
winstonLog.init(winston);
const logger = winstonLog.logger;

require("./routes/rhome.js")(app, swig);
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


var fs = require('fs');

/*
IMRPOVEMENT FOT LINUX -> https://stackoverflow.com/questions/24433580/device-computer-discovery-in-my-network
*/

var nmap = require('libnmap')


var devices = [];
var last_devices = [];
var opts = {
  flags: ["-sT", "-O"],
  range: [
    '192.168.0.1-200'
  ]
};
nmap.discover({}, function(err, report) {
  console.log("\n\nREPORT\n\n\n")
  if (err) throw new Error(err);
  for (let item in report.etho0) {
    console.log(JSON.stringify(report.etho0[item], null, 2));
  }
});
setInterval(function() {
  var last_devices = [];
}, 60000)





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

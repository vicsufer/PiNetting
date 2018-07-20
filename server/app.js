var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb')
const winston = require('winston');
var engine = require('express-dot-engine');
var path = require('path');
var sys = require('util')
var child_process = require('child_process'); //Cada llamada a exec crea un proceso nuevo o lo pone en cola????

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type , token
  next();
});



//mongodb
var gestorBD = require("./modules/gestorBD.js");
app.set('db', 'mongodb://localhost:27017/network_devices');
gestorBD.init(app, mongo);

//Winston logger
const winstonLog = require("./modules/logger.js")
winstonLog.init(winston);
const logger = winstonLog.logger;

require("./routes/rhome.js")(app, gestorBD);
require("./routes/rcmd.js")(app, child_process, io, gestorBD);
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

//Public folder
app.use(express.static('public'));

//Variables
app.set('port', 5000);
app.set('devices', []);

app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');


http.listen(app.get('port'), function() {
  logger.log({
    level: 'verbose',
    label: 'Bootstrap',
    message: 'Server started at ' + app.get('port')
  });
});


io.on('connection', function(socket) {

  socket.emit('connected_devices', app.get('devices'));

  logger.log({
    level: "verbose",
    label: 'Connection',
    message: 'User connected to socket'
  });

});

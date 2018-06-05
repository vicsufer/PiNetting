var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const winston = require('winston');

//Winston logger
const winstonLog= require("./modules/logger.js")
winstonLog.init(winston);
const logger = winstonLog.logger;

//Mongoose
mongoose.connect(`mongodb://admin:admin123@ds147420.mlab.com:47420/bordexchat`);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

//model
var model = require("./modules/model.js");
model.init(mongoose);

app.use(express.static('public'));

//Variables
app.set('port', 5000);
var chatrooms = [];

http.listen(app.get('port'), function() {
  logger.log({
    level: 'verbose',
    label: 'Bootstrap',
    message: 'Chat server started at ' + app.get('port')
  });
});

io.on('connection', function(socket) {

  logger.log({
    level: "verbose",
    label: 'Connection',
    message: 'User connected to socket'
  });

  socket.on('new_chatroom', function(data) {
    var chatroom = chatrooms.filter(x => x.room_name == data.name)[0];
    if(!chatroom)
    {
      chatrooms.push(new ChatRoom({
        'room_name': data.name
      }))
      logger.log({
        level: 'error',
        label: 'ChatRoom',
        message: 'Created chatroom: ' + data.name
      });
    }

  })

  socket.on('new_message', function(data) {
    var chatroom = chatrooms.filter(x => x.room_name == data.roomName)[0];
    if (chatroom) {
      chatroom.addMessage(new model.Message(data.username, data.text))
      io.sockets.emit('messages', chatroom.messages);
      logger.log({
        level: 'silly',
        label: 'Message',
        message: 'New message at: ' + chatroom.room_name
      });
    }

  })

  socket.on('join_chatroom', function(data) {
    var chatroom = chatrooms.filter(x => x.room_name == data.name)[0];
    if (chatroom) {
      logger.log({
        level: 'verbose',
        label: 'ChatRoom',
        message: 'User joined: ' + chatroom.room_name
      });
      socket.emit('messages', chatroom.messages);
    }
  });

  socket.on('disconnect', function() {
    logger.log({
      level: 'verbose',
      label: 'ChatRoom',
      message: 'User disconnected'
    });
  });

});

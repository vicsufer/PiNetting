var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const winston = require('winston');

//Winston logger
const winstonLog = require("./modules/logger.js")
winstonLog.init(winston);
const logger = winstonLog.logger;

//Mongoose
mongoose.connect(`mongodb://admin:admin123@ds147420.mlab.com:47420/bordexchat`);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

//model
var model = require("./modules/model.js");
model.init(mongoose, logger);

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
    if (chatroom) {
      logger.log({
        level: 'verbose',
        label: 'ChatRoom',
        message: 'Attempt to recreate a existent chatroom: ' + data.name
      });
    }

    if (!chatroom) {
      //If not in memory check in ddbb.
      ChatRoom.findByName(data.name, function(err, chatroom) {
        if (!chatroom) {
          chatrooms.push(new ChatRoom({
            'room_name': data.name
          }))
          logger.log({
            level: 'verbose',
            label: 'ChatRoom',
            message: 'Created chatroom: ' + data.name
          });
        } else {
          logger.log({
            level: 'verbose',
            label: 'ChatRoom',
            message: 'Attempt to recreate a existent chatroom: ' + data.name
          });
        }
      })
    }

  })

  socket.on('new_message', function(data) {
    if (socket.chatroom) {
      socket.chatroom.addMessage(new model.Message(data.username, data.text))
      io.sockets.emit('messages', socket.chatroom.messages);
    }

  })

  socket.on('join_chatroom', function(data) {
    var chatroom = chatrooms.filter(x => x.room_name == data.name)[0];

    if (!chatroom) {
      //If not in memory check in ddbb.
      ChatRoom.findByName(data.name, function(err, chatroom) {
        if (chatroom) {
          chatroom.increaseUsers();
          chatrooms.push(chatroom);
          socket.chatroom = chatroom;
          socket.emit('messages', chatroom.messages);
        }
      })
    } else {
      chatroom.increaseUsers();
      socket.emit('messages', chatroom.messages);
    }


  });

  socket.on('disconnect', function() {
    if( socket.currentRoom == null )
      return;

    socket.chatroom.decreaseUsers();
    if (socket.chatroom.meta.current_users == 0) {
      socket.chatroom.save();
      chatrooms = chatrooms.filter(x => x != socket.chatroom);
      logger.log({
        level: 'verbose',
        label: 'ChatRoom',
        message: `Chatroom ${socket.chatroom.room_name} persisted`
      });
      socket.chatroom = null;
    }
  });

});

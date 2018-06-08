module.exports = {

  ChatRoom: null,

  Message: function(username, text) {
    this.date = Date.now();
    this.username = username;
    this.text = text;
  },

  init: function(mongoose, logger) {
    this.logger = logger;
    this.mongoose = mongoose
    Schema = mongoose.Schema

    chatroomSchema = new Schema({
      room_name: String,
      creator: String,
      messages: [],
      meta: {
        current_users: {
          type: Number,
          default: 0
        }
      }
    });

    //ChatRoom methods
    chatroomSchema.methods.addMessage = function(message) {
      this.messages.push(message);
      logger.log({
        level: 'silly',
        label: 'Message',
        message: 'New message at: ' + this.room_name
      });
    }

    chatroomSchema.methods.increaseUsers = function() {
      logger.log({
        level: 'verbose',
        label: 'ChatRoom',
        message: 'User joined: ' + this.room_name
      });
      this.meta.current_users += 1;
    }
    chatroomSchema.methods.decreaseUsers = function() {
      logger.log({
        level: 'verbose',
        label: 'ChatRoom',
        message: 'User disconnected: ' +this.room_name
      });
      this.meta.current_users -= 1;
    }


    chatroomSchema.statics.findByName = function(name, cb) {
      return this.findOne({
        room_name: name
      }, cb)
    };

    ChatRoom = mongoose.model('ChatRoom', chatroomSchema);


  },

}

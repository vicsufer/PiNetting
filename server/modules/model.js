module.exports = {

  ChatRoom : null,

  Message: function(username, text)
  {
    this.date = Date.now();
    this.username = username;
    this.text = text;
  },

  init: function(mongoose) {
    this.mongoose = mongoose
    Schema = mongoose.Schema

    chatroomSchema = new Schema({
      room_name: String,
      creator: String,
      messages: [],
      meta: {
        current_users: {type: Number, default: 0}
      }
    });

    //ChatRoom methods
    chatroomSchema.methods.addMessage = function(message)
    {
      this.messages.push(message);
    }
    ChatRoom = mongoose.model('ChatRoom', chatroomSchema);


  },

}

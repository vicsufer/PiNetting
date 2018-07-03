var socket = io.connect("http://localhost:5000", {
  'forceNew': true
});

var currentRoom;

socket.on("messages", function(data) {
  render(data);
})

function hideChatMenu(e) {
  var chat = document.getElementById("chat-menu")
  var login = document.getElementById("login-menu")

  if (document.getElementById("username").value === "")
    return false

  if (chat.style.display === "none") {
    chat.style.display = "block";
    login.style.dislpay = "none";
  } else {
    chat.style.display = "none";
    login.style.display = "block";
  }
  return false
}

function render(data) {
  var html = data.map(function(elem, index) {
    return `<div>
              <strong>${elem.username}</strong>: ${elem.text}
            </div>`;
  }).join(" ");

  document.getElementById("currentRoom").innerHTML = currentRoom;
  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
  var payload = {
    roomName: currentRoom,
    username: document.getElementById('username').value,
    text: document.getElementById('text').value
  }
  socket.emit('new_message', payload);
  return false;
}

function joinChatroom(e) {
  currentRoom = document.getElementById('roomName').value;
  socket.emit('join_chatroom', {
    'name': currentRoom
  });
  return false;
}

function createChatroom(e) {
  var payload = {
    name: document.getElementById('newRoomName').value,
  }
  socket.emit('new_chatroom', payload);
  currentRoom = payload.name;
  return false;
}

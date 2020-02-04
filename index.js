var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let users = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
  socket.on('setUsername', (data) => {
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      console.log(`Client ${data} connected`);
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

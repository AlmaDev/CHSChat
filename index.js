var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post("/chat", (req, res) => {
  res.cookie('name', req.body.username);
  res.sendFile(__dirname + '/index.html');
});

function getCookie(cookie) {
  var cookiearray = cookie.split('=');
  for (var i = 0; i < cookiearray.length; i++) {
    if (cookiearray[i].includes('name')) {
      return cookiearray[i + 1].split(" ")[0].replace(";", "");
    }
  }
}


io.sockets.on('connection', function (socket) {
  var name = getCookie(socket.handshake.headers['cookie']);
  socket.emit("chat message", `User ${name} has joined the chat`)
  socket.on('chat message', function (msg) {
    io.emit('chat message', name + ":   " + msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

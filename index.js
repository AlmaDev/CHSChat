var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

let users = {};

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
})

app.post("/chat", (req, res) => {
  res.cookie('name', req.body.username);
  res.sendFile(__dirname + '/index.html');
});

function getCookie(cookie) {
  var cookiearray = cookie.split(';');
  for (var i = 1; i < cookiearray.length; i++) {
    name = cookiearray[i].split('=')[0];
    value = cookiearray[i].split('=')[1];
    return value;
  }
}


io.sockets.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    console.log(socket.handshake.headers['cookie']);
    console.log(getCookie(socket.handshake.headers['cookie']));
    io.emit('chat message', getCookie(socket.handshake.headers['cookie']) + ":   " + msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

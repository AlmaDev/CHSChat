const app = require("express")();
const SocketAntiSpam = require("socket-anti-spam");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat?", (req, res) => {
  // res.sendFile(__dirname  + "/error.html");
  res.redirect("/")
})

app.post("/chat", (req, res) => {
  res.cookie("name", req.body.username);
  res.sendFile(__dirname + "/index.html");
});

app.get("/admin", (req,res) => {
  if(req.param("code") === "Marco>Damir") {
    res.sendFile(__dirname + "/admin.html")
  }
})

function getCookie(cookie) {
  var cookiearray = cookie.split("=");
  for (var i = 0; i < cookiearray.length; i++) {
    if (cookiearray[i].includes("name")) {
      return cookiearray[i + 1].split(" ")[0].replace(";", "");
    }
  }
}

io.sockets.on("connection", socket => {
  var name = getCookie(socket.handshake.headers["cookie"]);
  io.emit("chat message", `User ${name} has joined the chat`);
  socket.emit('join', name);
  socket.on("chat message", function(msg) {
    io.emit("chat message", name + ": " + msg);
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const users = ["John", "Smith", "Colt", "lander", "steel"];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", { users });
});

app.get("/users", (req, res) => {
  res.render("user", { users });
});

app.post("/create-users", (req, res) => {
  const { username } = req.body;
  users.push(username);
  res.render("chat", { username });
});

server.listen(3000, () => {
  console.log("Listening to request on port 3000");
});

io.on("connection", (socket) => {
  console.log("socket connection completed", socket.id);

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

const express = require("express");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const cors = require('cors');
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT;
const socketPort = process.env.SOCKET_PORT;
const viewPath = path.join(__dirname, "./view");

app.use(cors({
  origin: '*',
}));

app.get("/stream", (_, res) =>{
  res.sendFile(path.join(viewPath , "stream.html"));
});
app.get("/view", (_, res) =>{
  res.sendFile(path.join(viewPath , "view.html"));
});

app.listen(port, () => {
  console.info(`Server :: http://localhost:${port}`);
});

const io = socketIo(socketPort, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  path: "/",
  serveClient: true,
  origins: "*",
  cookie: true,
  pingInterval: 1000,
  pingTimeout: 1000,
  upgradeTimeout: 1000,
  allowUpgrades: true,
  cookiePath: "/",
  cookieHttpOnly: true,
});

io.on("connection", function (socket) {
  socket.on("stream", function (data) {
    socket.broadcast.emit("stream", data);
  });
});

io.of("/stream", (error, clients) => {
  if (error) throw error;
  console.log(clients);
});

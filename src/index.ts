import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer(function (req, res) {
  res.end("hi there");
});

const wss = new WebSocketServer({ server });

let userCount = 0;

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  console.log("User connected", ++userCount);
  ws.send("Hello from WebSocket");
});

server.listen(8080, function () {
  console.log(new Date() + "Server is listening on 8080");
});

const sslRedirect = require("heroku-ssl-redirect");
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;
const server = require("http").Server(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const mustacheExpress = require("mustache-express");

// const ipfilter = require('express-ipfilter').IpFilter;

// const ips = ['135.26.240.220', '192.168.0.117', '10.40.110.51'];

// app.use(ipfilter(ips, { mode: 'allow' }));
// module.exports = app;

app.use(sslRedirect());

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("./dist"));

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", heartbeat);
  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 3000);

wss.on("close", function close() {
  clearInterval(interval);
});

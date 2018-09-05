// arquivo principal

var estado = 1;
// 1 - RELEASED
// 2 - WANTED
// 3 - HELD


const PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";

const dgram = require("dgram");
const process = require("process");

// cria o multicast socket
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

// coloca para ele escuta na porta
socket.bind(PORT);
socket.on("listening", function() {
  socket.addMembership(MULTICAST_ADDR);
  setInterval(sendMessage, 2500);
  const address = socket.address();
  console.log(
    `UDP socket listening on ${address.address}:${address.port} pid: ${
      process.pid
    }`
  );
});

function sendMessage() {
  const message = Buffer.from(`Message from process ${process.pid}`);
  socket.send(message, 0, message.length, PORT, MULTICAST_ADDR, function() {
    console.info(`Sending message "${message}"`);
  });
}

socket.on("message", function(message, rinfo) {
  console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
});

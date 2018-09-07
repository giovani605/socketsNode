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
const socketMulticast = dgram.createSocket({ type: "udp4", reuseAddr: true });

// coloca para ele escuta na porta
socketMulticast.bind(PORT);
// executa uma funcao quando ele começa a executar o multicast
socketMulticast.on("listening", function() {
  socketMulticast.addMembership(MULTICAST_ADDR);
//  setInterval(sendMessage, 2500);
  const address = socketMulticast.address();
  console.log(
    `UDP socket listening on ${address.address}:${address.port} pid: ${
      process.pid
    }`
  );
});

// envia a mensagem
function sendMessage() {
  const message = Buffer.from(`Message from process ${process.pid}`);
  socketMulticast.send(message, 0, message.length, PORT, MULTICAST_ADDR, function() {
    console.info(`Sending message "${message}"`);
  });
}

// recebe uma mensagem
socketMulticast.on("message", function(message, rinfo) {
  console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
});

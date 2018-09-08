// arquivo principal
var estado = 1;
// 1 - RELEASED
// 2 - WANTED
// 3 - HELD

// TODO fazer algo apra ler do teclado para eu poder sair do programa
// e entrar e sair da SC

const MULTICAST_PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";

const dgram = require("dgram");
const process = require("process");

// cria o multicast socket
const socketMulticast = dgram.createSocket({ type: "udp4", reuseAddr: true });

// coloca para ele escuta na porta
socketMulticast.bind(MULTICAST_PORT);

// Eventos da Rede
// executa uma funcao quando ele começa a executar o multicast
// executada apenas uma vez
socketMulticast.on("listening", function () {
  socketMulticast.addMembership(MULTICAST_ADDR);
  //  setInterval(sendMessage, 2500);
  const address = socketMulticast.address();
  console.log(
    `UDP socket listening on ${address.address}:${address.port} pid: ${
    process.pid
    }`
  );
  sendMessage(
    { "tipo": "um", "msg": "teste3" }
  )
});

// envia a mensagem
function sendMessage(mensagem) {
  socketMulticast.send(JSON.stringify(mensagem), 0, JSON.stringify(mensagem).length, MULTICAST_PORT, MULTICAST_ADDR, function () {
    console.info(`Sending message "${mensagem}"`);
  });
}

// recebe uma mensagem
socketMulticast.on("message", function (message, rinfo) {
  // processar a mensagem
  dados = JSON.parse(message);

  if (dados.tipo == null) {
    // mensagem com problemas 
    return;
  }
  // novo peer
  if (dados.tipo == "novo") {
    // adiciona o peer na rede de conhecidos
    return;
  }
  // saida de peer
  if (dados.tipo == "sair") {
    // remove o peer na rede de conhecidos
    return;
  }

  // entrar 
  if (dados.tipo == "entrar") {
    // responder o peer de acordo com o meu estado
    return;
  }
  // sair da zona SC?
  // acredito   que nao precisa

  console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${dados}`);
});

// Eventos do usuario
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

printarComandos();
function printarComandos() {
  console.log("Comandos Disponiveis: sair entrar leave ajuda")
}

// Crio uma funcao de CallBack para o evento de o usuario digitar alguma coisa
var funcQuestao = (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);
  if (answer == "sair") {
    rl.close();
    // TODO forçar a saida do programa
    return;
  }
  if (answer == "entrar") {
    rl.close();
    // TODO envia uma mensagem para entrar na SC
    return;
  }
  if (answer == "leave") {
    rl.close();
    // TODO envia uma mensagem para sair na SC
    return;
  }
  if (answer == "ajuda") {
    rl.close();
    printarComandos();
    return;
  }
  // faço a questao denovo no final para ficar em loop infinito
  rl.question('Oq fazer? ', funcQuestao);
}

rl.question('Oq fazer? ', funcQuestao);

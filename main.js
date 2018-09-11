// arquivo principal
var estado = 1;
// 1 - RELEASED
// 2 - WANTED
// 3 - HELD

// Mapa com os peer que encontrei na rede
var MapaRede = new Map();
const variaveis = require("./variaveisGlobais");
const dgram = require("dgram");
const process = require("process");
var Peer = require("./peer");
var serverUnicast = require("./server");

// cria o multicast socket
const socketMulticast = dgram.createSocket({ type: "udp4", reuseAddr: true });

// coloca para ele escuta na porta
socketMulticast.bind(variaveis.MULTICAST_PORT);

// Eventos da Rede
// executa uma funcao quando ele começa a executar o multicast
// executada apenas uma vez
socketMulticast.on("listening", function () {
  socketMulticast.addMembership(variaveis.MULTICAST_ADDR);
  //  setInterval(sendMessage, 2500);
  const address = socketMulticast.address();
  console.log(
    `UDP socket listening on ${address.address}:${address.port} pid: ${
    process.pid
    }`
  );
  sendMessage(
    { "tipo": "novo", "processId": process.ppid, "chave": 1, "porta": 1 }
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
  // adiciona o peer na rede de conhecidos
  if (dados.tipo == "novo") {
    key = dados.processId + rinfo.address;
    console.log(key);
    let a = new Peer(dados.porta, dados.processId, dados.chave, rinfo.address);
    MapaRede.set(key, a);
    console.log(a);
    return;
  }
  // saida de peer
  if (dados.tipo == "sair") {
    // remove o peer na rede de conhecidos
    let processId = dados.processId;
    let key = dados.processId + rinfo.address;
    let a = MapaRede.delete(key);
    console.log(a);
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
function SairRede(){
  sendMessage(
    { "tipo": "sair", "processId": process.ppid, "chave": 1 }
  )

  // enviar mensagem de sair
}
function EntrarSC(){
  // mandar uma mensagem para todos os peer conhecidos
  for(let p in MapaRede ){
      // criar uma conexao tcp e esperar resposta
  }
}
// Crio uma funcao de CallBack para o evento de o usuario digitar alguma coisa
var funcQuestao = (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);
  if (answer == "sair") {
    SairRede();
    rl.close();
    // TODO forçar a saida do programa
    return;
  }
  if (answer == "entrar") {
    EntrarSC();
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

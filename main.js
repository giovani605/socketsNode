// arquivo principal


// Mapa com os peer que encontrei na rede
const variaveis = require("./variaveisGlobais");
const dgram = require("dgram");
const process = require("process");
var Peer = require("./peer");
var serverUnicast = require("./server");
var gerenciadorUnicast = require("./GerenciadorClientesUniCast");

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
    { "tipo": "novo", "processId": process.ppid, "chave": variaveis.chave, "porta": variaveis.PORT }
  )
});

// envia a mensagem
function sendMessage(mensagem) {
  // Envia uma mensagem para o multicast
  socketMulticast.send(JSON.stringify(mensagem), 0, JSON.stringify(mensagem).length,
   variaveis.MULTICAST_PORT, variaveis.MULTICAST_ADDR, function () {
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
    if(dados.chave == variaveis.chave){
      return;
    }

    key = dados.processId + rinfo.address;
    console.log(key);
    let a = new Peer(dados.porta, dados.processId, dados.chave, rinfo.address);
    variaveis.mapa.set(key, a);
    console.log(a);
    gerenciadorUnicast.responderMulticast(rinfo.address,dados.porta,{
      "chave" : variaveis.chave,
      "porta" : variaveis.PORT,
      "processId" : process.ppid,
      "tipo" : "rede"
    });
    return;
  }
  // saida de peer
  if (dados.tipo == "sair") {
    // remove o peer na rede de conhecidos
    let processId = dados.processId;
    let key = dados.processId + rinfo.address;
    let a = variaveis.mapa.delete(key);
    console.log(a);
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
    { "tipo": "sair", "processId": process.ppid, "chave": variaveis.chave }
  )

  // enviar mensagem de sair
}

function EntrarSC(){
  variaveis.estado = 2;
  terminou = false;
  
  
  // mandar uma mensagem para todos os peer conhecidos
  gerenciadorUnicast.entrarSC(variaveis.mapa);
  gerenciadorUnicast.eventos.on("sucesso", () => {
    console.log("Sucesso em entrar na Secao critica");
    variaveis.estado = 3;
    setTimeout(()=>{
      console.log("sainda da secao critica");
      variaveis.estado = 1;
      variaveis.eventos.emit("SairSC");
      loop();
    },variaveis.tempo);
    
    
  });
  gerenciadorUnicast.eventos.on("fracasso", () => {
    console.log("Falha em entrar na Secao critica");
    variaveis.estado = 1;
    loop();
  });
  // verificar como vou retornar tudo isso
}
// Crio uma funcao de CallBack para o evento de o usuario digitar alguma coisa
var funcQuestao = (answer) => {
  // TODO: Log the answer in a database
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
    loop();
    return;
  }
  // faço a questao denovo no final para ficar em loop infinito
  
}
function loop(){
  rl.question('Oq fazer? ', funcQuestao);
}
loop();

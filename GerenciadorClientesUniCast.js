// esse modulo cuida de criar os clientes para as comunicacoes unicast
// ele vai possuir uma lista de sockets 


var net = require('net');

var HOST = 'localhost';

var ListaClientes = [];
var events = require('events');
//usar esse emissor para cada vez q receber uma resposta do cliente
var eventos =  new events.EventEmitter();

eventos.on("resposta",processarResposta);

// cliente
function criarCliente(host, porta) {
    var client = new net.Socket();
    ListaClientes.push(client);
    client.connect(PORT, HOST, function () {
        console.log('Client connected to: ' + HOST + ':' + PORT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
        client.write('Hello World!');

    });
    client.on('data', function (data) {
        // processar as msg que vem do unicast
        console.log('Client received: ' + data);
        if (data.toString().endsWith('exit')) {
            client.destroy();
        }
        // a resposta esta ok
        // incluir parametros depois
        eventos.emit("resposta");

    });
    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Client closed');
    });
    client.on('error', function (err) {
        console.error(err);
    });



}
// crio os clientes para entrar na SC e agurdo reposta
// emitir eventos de sucesso ou nao da secao critica
function entradaSC(mapa) {
    console.log("cheguei aqui")
    for(let p in mapa ){
        // criar uma conexao tcp e esperar resposta
        criarCliente(p.host,p.porta);
    }
    // setar o timer
    
}


function processarResposta(){

}


exports.entrarSC = entradaSC;

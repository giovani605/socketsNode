// esse modulo cuida de criar os clientes para as comunicacoes unicast
// ele vai possuir uma lista de sockets 


var net = require('net');

var HOST = 'localhost';

var ListaClientes = [];
var events = require('events');
//usar esse emissor para cada vez q receber uma resposta do cliente
var eventos =  new events.EventEmitter();


// eventos finais - Sucesso e fracasso para entrar na SC
eventos.on("sucesso",sucesso);
eventos.on("fracasso",fracasso);

function sucesso(){
    // alguma deve ser feita
}
function fracasso(){
    // alguma coisa deve ser feita
}


var contador = 0;
// cliente
function criarCliente(host, porta,itemMapa) {
    var client = new net.Socket();
    ListaClientes.push(client);
    client.connect(porta, host, function () {
        console.log('Conexao criada com o peer ' + host + ':' + porta);
        let dados = {
            "tipo" : "SC"
        }
        // Manda mensagem para o peer
        client.write(JSON.stringify(dados));

    });
    client.on('data', function (data) {
        // processar as msg que vem do unicast
        console.log('Client received: ' + data);
        let dados = JSON.parse(data);
        if(dados.permissao == null){
            // falha
        }
        if(dados.permissao == true){
            // sucesso
            contador++;
            if(contador == mape.size){
                eventos.emit("sucesso");
            }

        }
        if(dados.permissao == false){
            eventos.emit("fracasso");
        }

        // if (data.toString().endsWith('exit')) {
        //     client.destroy();
        // }
        // a resposta esta ok
        // incluir parametros depois

    });
    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Client closed');
    });
    client.on('error', function (err) {
        // falha do peer
        console.error(err);
    });



}
// deixar isso aqui menos feio depois
var mape;
// crio os clientes para entrar na SC e agurdo reposta
// emitir eventos de sucesso ou nao da secao critica
function entradaSC(mapa) {
    contador = 0;
    mape = mapa;
    console.log("Iniciando conexao com os peer")
    mape.forEach(element => {
        console.log("tentando conectar peer " + element);
        criarCliente(element.host,element.porta,element);
    });
    // setar o timer
    
}

function criarClienteRede(host, porta,dados) {
    // os dados ja vem em formanto JSON
    var client = new net.Socket();
    console.log(host + ":"+porta);
    client.connect(porta, host, function () {
        console.log('Conexao criada com o peer ' + host + ':' + porta);
        // Manda mensagem para o peer com meus dado
        client.write(JSON.stringify(dados));
        // fecha a conexao
    });
    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Client closed');
    });
    client.on('error', function (err) {
        // falha do peer
        console.error(err);
    });



}





exports.entrarSC = entradaSC;
exports.eventos = eventos;
exports.responderMulticast = criarClienteRede;
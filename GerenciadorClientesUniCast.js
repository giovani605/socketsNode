// esse modulo cuida de criar os clientes para as comunicacoes unicast
// ele vai possuir uma lista de sockets 


var net = require('net');

var HOST = 'localhost';
const variaveis = require("./variaveisGlobais");

var ListaClientes = [];
var events = require('events');
//usar esse emissor para cada vez q receber uma resposta do cliente
var eventos = new events.EventEmitter();


// eventos finais - Sucesso e fracasso para entrar na SC
eventos.on("sucesso", sucesso);
eventos.on("fracasso", fracasso);

function sucesso() {
    // alguma deve ser feita
}
function fracasso() {
    // alguma coisa deve ser feita
}

var mape;
// crio os clientes para entrar na SC e agurdo reposta
// emitir eventos de sucesso ou nao da secao critica
// TODO limpar essa parte do codigo, colocar variaveis.mapa
function entradaSC(mapa) {
    contador = 0;
    mape = mapa;
    console.log("Iniciando conexao com os peer")

    mape.forEach(element => {
        element.tempo = variaveis.tempo;
        criarCliente(element.ip, element.porta, element);
    });
    // setar o timer

}
var contador = 0;
// cliente
function criarCliente(host, porta, itemMapa) {
    host = "localhost";
    var client = new net.Socket();
    ListaClientes.push(client);
    client.setTimeout(5000);
    var respondeu = false;
    console.log("Criando conexao com para SC -- " + host + ":" + porta);
    client.connect(porta, host, function () {
        console.log('Conexao criada com o peer ' + host + ':' + porta);
        let dados = {
            "tipo": "SC",
            "Ti": itemMapa.tempo
        }
        // Manda mensagem para o peer
        client.write(JSON.stringify(dados));

    });
    client.on('data', function (data) {
        respondeu = true;
        // processar as msg que vem do unicast
        console.log('Client received: ' + data);
        let dados = JSON.parse(data);
        if (dados.permissao == null) {
            // falha
        }
        if (dados.permissao == true) {
            // sucesso
            contador++;
            if (contador == mape.size) {
                eventos.emit("sucesso");
            }
            client.destroy();
        }
        if (dados.permissao == false) {
            console.log("Há processos na sua frente, espere");
        }

        // if (data.toString().endsWith('exit')) {
        //     client.destroy();
        // }
        // a resposta esta ok
        // incluir parametros depois

    });
    client.on("timeout", function () {
        if (!respondeu) {
            console.log('Timeout');
            client.destroy();
        }
        // remover do mapa
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


// Respondo a entrada de alguem novo no multicast com meus dados
function criarClienteRede(host, porta, dados) {
    // os dados ja vem em formanto JSON
    host = "localhost";
    var client = new net.Socket();
    // Delta t1

    client.connect(porta, host, function () {
        console.log('Conexao criada com o peer ' + host + ':' + porta);
        // Manda mensagem para o peer com meus dados
        client.write(JSON.stringify(dados));
        // fecha a conexao
        //client.destroy();
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
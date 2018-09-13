// esse arquivo cuida das conexoes tcp
"use strict"

const variaveis = require("./variaveisGlobais");
var gerenciadorUnicast = require("./GerenciadorClientesUniCast");
// Server
var net = require('net');
const process = require("process");
// Configuration parameters
var HOST = 'localhost';
// Create Server instance 
// coloco que a funcao onClienteConnect respode os request
var server = net.createServer(onClientConnected);
// Executa uma ver quando o server começa a executar
server.listen(variaveis.PORT, HOST, function () {
    console.log('server listening on %j', server.address());
});

// toda vez que um cliente conecta essa funcao eh chamada
function onClientConnected(sock) {

    // autenticar a conexao 
    // caso a autenticao falhe devo matar a conexao
    var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('new client connected: %s', remoteAddress);

    sock.on('data', function (data) {
        // aqui vou processar as mensagens
        console.log('%s Says: %s', remoteAddress, data);
        let dados = JSON.parse(data);
        if (dados.tipo == null) {
            // Falha
            return;
        }
        // pode ser resposta da entrada da rede
        if (dados.tipo == "rede") {
            // criar um novo item na rede

            key = dados.processId + rinfo.address;
            console.log(key);
            let a = new Peer(dados.porta, dados.processId, dados.chave, sock.remoteAddress);
            MapaRede.set(key, a);
            console.log(a);
            console.log("Resposta do multicast com sucesso")

            return;
        }
        if (dados.tipo == "SC") {
            // Permitir entrada SC
            var reposta;
            if (variaveis.estado == 1) {
                reposta = {
                    "permissao": true
                }
            }
            // ver como tratar esse estado
            if (variaveis.estado == 2) {
                reposta = {
                    "permissao": false
                }
            }
            if (variaveis.estado == 3) {
                reposta = {
                    "permissao": false
                }
            }
            sock.write(JSON.stringify(reposta));
            return;
        }

        // ou pode ser a parte de permitir a SC
    });
    sock.on('close', function () {
        console.log('connection from %s closed', remoteAddress);
    });
    sock.on('error', function (err) {
        console.log('Connection %s error: %s', remoteAddress, err.message);
    });
};


// esse arquivo cuida das conexoes tcp
"use strict"

const variaveis = require("./variaveisGlobais");

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
// 
function onClientConnected(sock) {

    // autenticar a conexao 
    // caso a autenticao falhe devo matar a conexao
    var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('new client connected: %s', remoteAddress);

    sock.on('data', function (data) {
        // aqui vou processar as mensagens
        // pode ser resposta da entrada da rede
        // ou pode ser a parte de permitir a SC
        console.log('%s Says: %s', remoteAddress, data);
        sock.write(data);
        sock.write(' exit');
    });
    sock.on('close', function () {
        console.log('connection from %s closed', remoteAddress);
    });
    sock.on('error', function (err) {
        console.log('Connection %s error: %s', remoteAddress, err.message);
    });
};


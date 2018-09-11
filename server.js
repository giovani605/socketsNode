// esse arquivo cuida das conexoes tcp
"use strict"


// Server

var net = require('net');
const process = require("process");
// Configuration parameters
var HOST = 'localhost';

if (process.argv[2] == null) {
    var PORT = 1234;
} else {
    var PORT = process.argv[2];
}

// Create Server instance 
// coloco que a funcao onClienteConnect respode os request
var server = net.createServer(onClientConnected);
// Executa uma ver quando o server começa a executar
server.listen(PORT, HOST, function () {
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

// cliente

var net = require('net');
 
var HOST = 'localhost';

 
var client = new net.Socket();
 
client.connect(PORT, HOST, function() {
    console.log('Client connected to: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('Hello World!');
 
});
 
client.on('data', function(data) {  
    // processar as msg que vem do unicast
    console.log('Client received: ' + data);
     if (data.toString().endsWith('exit')) {
       client.destroy();
    }
});
 
// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Client closed');
});
 
client.on('error', function(err) {
    console.error(err);
});
// Esse arquivo vai conter as configuaracoes do nosso processo
const process = require("process");
const os = require("os");
const network = os.networkInterfaces();
var Random = require("random-js");
var r = new Random();
var events = require('events');
if (process.argv[2] == null) {
    var PORT = r.integer(2000,60000);
} else {
    var PORT = process.argv[2];
}
const MULTICAST_PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";
function  gerarChavePublica(){
    // gerar a chave atual a partir do tempo
    return r.integer(0,60000);
}
const chave = gerarChavePublica();
console.log(PORT);

var estado = 1;
// 1 - RELEASED
// 2 - WANTED
// 3 - HELD
var MapaRede = new Map();
var eventos =  new events.EventEmitter();
var tempo = r.integer(1000,20000);

exports.PORT = PORT;
exports.MULTICAST_ADDR = MULTICAST_ADDR;
exports.MULTICAST_PORT = MULTICAST_PORT;
exports.chave = chave;
exports.estado = estado;
exports.mapa = MapaRede;
exports.eventos = eventos;
exports.tempo = tempo;
// Esse arquivo vai conter as configuaracoes do nosso processo
const process = require("process");
const os = require("os");
const network = os.networkInterfaces();
var Random = require("random-js");
var r = new Random();
if (process.argv[2] == null) {
    var PORT = r.integer(2000,60000);
} else {
    var PORT = process.argv[2];
}
const MULTICAST_PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";
function  gerarChavePublica(){
    // gerar a chave atual a partir do tempo
    return process.ppid+ (new Date().toString);
}
const chave = gerarChavePublica();
console.log(PORT);

exports.PORT = PORT;
exports.MULTICAST_ADDR = MULTICAST_ADDR;
exports.MULTICAST_PORT = MULTICAST_PORT;
exports.chave = chave;
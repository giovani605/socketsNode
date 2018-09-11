// Esse arquivo vai conter as configuaracoes do nosso processo
const process = require("process");

if (process.argv[2] == null) {
    var PORT = 1234;
} else {
    var PORT = process.argv[2];
}
const MULTICAST_PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";



exports.PORT = PORT;
exports.MULTICAST_ADDR = MULTICAST_ADDR;
exports.MULTICAST_PORT = MULTICAST_PORT;
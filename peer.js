"use strict"

// Essa calsse vai representar os peer que a gente encontrar
class peer{
    constructor(porta,processId,chave,ip){
        this.porta = porta;
        this.ip = ip;
        this.processId = processId;
        this.chave = chave;
    }
}
module.exports = peer; 
let connections = {};
let playerList = {};

var method = PlayerHost.prototype;

function PlayerHost(name) {
    this.name = name;
    this.nbJoueur = 1;
    this.indicePremierJoueur = 1;
    this.indiceDernierJoueur = 1;
    this.PHLeftB = null;
    this.PHRightB = null;
    this.PHFather = null;
    this.PHSon = null;
    this.timestamp = new Date().getTime();
    console.log('Nouvel objet Player créé : ' + this.name);
    
    method.createConnection = function(player) {

    }

    method.setList = function(playerList) {
        this.playerList = playerList;
    }
    
    function addConnection(connection) {
        this.connections[connection.id] = connection;
    }

    function removeConnection(connection) {
        this.connections.splice(this.connections.indexOf(connection.id), 1);
    }

    function setPHRightB(PHRightB) {
        this.PHRightB = PHRightB;
    }

    function setPHLeftB(PHLeftB) {
        this.PHLeftB = PHLeftB;
    }

    function setPHFather(PHFather) {
        this.PHFather = PHFather;
    }

    function setPHSon(PHSon) {
        this.PHSon = PHSon;
    }

}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = PlayerHost;
} else {
    window.PlayerHost = PlayerHost;
}
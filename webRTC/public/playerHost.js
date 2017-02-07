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
    console.log('Nouvel objet PlayerHost créé : ' + this.name);
}

function createConnection(player) {
    let connection = new Connection();

    pcLocal = new RTCPeerConnection(cfg, con);
    pcLocal.onicecandidate = function () {
        if (pcLocal.iceGatheringState == "complete" && !offerSent) {
            offerSent = true;
            sendNegotiation("offer", pcLocal.localDescription);
        }
    };
    dc1 = pcLocal.createDataChannel(createID(player.name, this.name), {reliable: true});
    connection.sendChannel = dc1;
    activedc = dc1;
    dc1.onopen = function () {
        console.log('Connected');
        let data = {user: "system", message: "the datachannel " + dc1.label + " has been opened"};
        writeMsg(data);
        offerSent = false;
    };
    dc1.onmessage = function (e) {
        if (e.data.charCodeAt(0) == 2) {
            return
        }
        let data = JSON.parse(e.data);
        writeMsg(data);
    };
    pcLocal.createOffer(function (desc) {
        pcLocal.setLocalDescription(desc, function () {
        }, function () {
        });
        console.log("------ SEND OFFER ------");

    }, function () {
    }, sdpConstraints);

    pcLocalList[createID(player, this)] = pcLocal;
    if (dc1 != null) {
        dcList[createID(player, this)] = dc1;
    }
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
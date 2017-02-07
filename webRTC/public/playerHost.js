let dataChannels = [];
let playerList = {};
let parent;
let method = PlayerHost.prototype;

function PlayerHost(name) {
    this.name = name;
    this.nbJoueur = 1;
    this.indicePremierJoueur = 1;
    this.indiceDernierJoueur = 1;
    this.PHLeftB = null;
    this.PHRightB = null;
    this.PHFather = null;
    this.PHSon = null;
    
    // Coordonnées zones :
    
    this.point1 = [1,1];
    this.point2 = [2,2];
    this.point3 = [3,3];
    this.point4 = [4,4];
    	
    this.timestamp = new Date().getTime();
    console.log('Nouvel objet PlayerHost créé : ' + this.name);
}

function createConnection(player) {

    parent = this;
    pcLocal = new RTCPeerConnection(cfg, con);
    pcLocal.onicecandidate = function () {
        if (pcLocal.iceGatheringState == "complete" && !offerSent) {
            offerSent = true;
            sendNegotiation("offer", pcLocal.localDescription, parent.name, player.name);
        }
    };
    dc1 = pcLocal.createDataChannel(createID(player.name, this.name), {reliable: true});
    activedc = dc1;
    dc1.onopen = function () {
        console.log('Connected');
        dataChannels.push(dc1);
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

method.setList = function (playerList) {
    this.playerList = playerList;
};

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

function getPHRightB() {
    return PHRightB;
}

function getPHLeftB() {
	return PHLeftB;
}

function getPHFather() {
	return PHFather;
}

function getPHSon() {
	return PHSon;
}

function setZone(point11,point22,point33,point44) {
    this.point1 = point11;
    this.point2 = point22;
    this.point3 = point33;
    this.point4 = point44;
}

function getZone() {
	return null;
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = PlayerHost;
} else {
    window.PlayerHost = PlayerHost;
}
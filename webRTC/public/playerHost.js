
let PlayerHost = function (){

	   // console.log('Nouvel objet PlayerHost créé : ' );
	this.dataChannels = [];
	this.playerList = {};
	this.parent;
	this.name = "bob ";
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

	 this.sendData = function(data){
	    if (data) {
	        dataChannels.forEach(function (dataChannel) {
	            dataChannel.send(JSON.stringify({message:data, user: parent.name}));
	        });
	        chatlog.innerHTML += '[' + this.name + '] ' + messageTextBox.value + '</p>';
	        messageTextBox.value = "";
	    }
	    return false
	};

    this.createConnection = function(playerName) {
     return new Promise(function (resolve, reject) {
         parent = this;
         pcLocal = new RTCPeerConnection(cfg, con);
         pcLocal.onicecandidate = function () {
             if (pcLocal.iceGatheringState == "complete" && !offerSent) {
                 console.log("player : " + playerName + " host : " + parent.name);
                 offerSent = true;
                 sendNegotiation("offer", pcLocal.localDescription, player.name, playerName);
             }
         };
         dc1 = pcLocal.createDataChannel(createID(playerName, player.name), {reliable: true});
         activedc = dc1;
         dc1.onopen = function () {
             console.log('Connected');
             dataChannels.push(dc1);
             let data = {user: "system", message: "the datachannel " + dc1.label + " has been opened"};
             writeMsg(data);
             offerSent = false;
             resolve("CONNECTED");
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

         pcLocalList[createID(playerName, player.name)] = pcLocal;
         if (dc1 != null) {
             dcList[createID(playerName, player.name)] = dc1;
         }
     });
};

function sendData(data,){
    if (data) {
        dataChannels.forEach(function (dataChannel) {
            dataChannel.send(JSON.stringify({message:data, user: parent.name}));
        });
        chatlog.innerHTML += '[' + this.name + '] ' + messageTextBox.value + '</p>';
        messageTextBox.value = "";
    }
    return false
}

	this.setList = function (playerList) {
		playerList = playerList;
	};

	this.addConnection = function (connection){
		connections[connection.id] = connection;
	};

	this.removeConnection = function(connection){
	    connections.splice(connections.indexOf(connection.id), 1);
	};

	this.setPHRightB = function(PHRightB) {
	    PHRightB = PHRightB;
	};

	this.setPHLeftB = function(PHLeftB) {
	    PHLeftB = PHLeftB;
	};

	this.setPHFather = function(PHFather){
	    PHFather = PHFather;
	};

	this.setPHSon = function(PHSon){
	    PHSon = PHSon;
	};

	this.getPHRightB = function(){
	    return PHRightB;
	};

	this.getPHLeftB = function(){
		return PHLeftB;
	};

	this.getPHFather = function(){
		return PHFather;
	};

	this.getPHSon = function(){
		return PHSon;
	};

	this.setZone = function(point11,point22,point33,point44){
	    point1 = point11;
	    point2 = point22;
	    point3 = point33;
	    point4 = point44;
	};

	this.getZone = function() {
		return null;
	};
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = PlayerHost;
} else {
    window.PlayerHost = PlayerHost;
}
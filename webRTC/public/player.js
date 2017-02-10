let Player = function (name){
	
	this.neighborhood = [] ;
	this.name = name;
	this.dataChannel = null;
	this.radius = 0;
	this.angle = 0;
	this.speed = 0;
	this.coordonneX = 0;
	this.coordonneY = 0;
	this.rank = 1 ;
		
    console.log('Nouvel objet Player créé : ' + name );
    
	this.getCoordonneX = function (coordonneX){
    	this.coordonneX = coordonneX;
    };

    this.getCoordonneY = function (coordonneY){
        this.coordonneY = coordonneY;
    };

    this.setRadius = function (radius){
        this.radius = radius;
    };

    this.setSpeed = function (speed){
        this.speed = speed;
    };

    this.setAngle = function(angle){
        this.angle = angle;
    };
       
    this.setRank = function (rank1){
    	this.rank = rank1;
    }; 

    this.setDataChannel = function(dataChannel){
        this.dataChannel = dataChannel;
    };

    this.getCoordonneX = function(){
        return CoordonneX;
    };

    this.getCoordonneY = function() {
        return CoordonneY;
    };

    this.getAngle = function () {
        return angle;
    };

    this.getRadius = function () {
        return radius;
    };
    
    this.getName = function(){
    	return name;
    };


    this.getSpeed = function () {
        return speed;
    };

    this.getRank = function () {
        return rank;
    };

    this.sendPosition = function () {
        const data = {
            "name": player.name,
            "radius": player.radius,
            "angle": player.angle,
            "x": player.coordonneX,
            "y": player.coordonneY,
            "speed": player.speed,
            "timestamp": player.timestamp,
            "type": "position"
        };
        sendData(data, player.dataChannel);
    };

    this.receiveConnection = function (offer, familyType) {
        let pcRemote = new RTCPeerConnection(cfg, con);
        pcRemote.ondatachannel = function (e) {
            dc2 = e.channel || e;
            dc2.onopen = function () {
                if (familyType == "PHRightB") {
                    host.setPHLeftB(dc2)
                }
                else if (familyType == "PHSon1" || familyType == "PHSon2") {
                    host.setPHFather(dc2)
                }
                else {
                    player.setDataChannel(dc2);
                }
                console.log('Connected');

                //on écrit dans le chat que le myPlayer s'est connecté
                let data = {user: "system", message: "the datachannel " + dc2.label + " has been opened"};
                writeMsg(data);
                answerSent = false;
                console.log("DONE");
            };
            dc2.onmessage = function (e) {
                let data = JSON.parse(e.data);
                switch (data.message.type) {
                	case "voisinage" :
                		player.neighborhood = data.message.voisinage;
                		break;
                	case "initPosition" :
                		console.log(data);
                		break;
                    default :
                        break;
                }
                writeMsg(data);
            };
        };
        pcRemote.onicecandidate = function () {
            if (pcRemote.iceGatheringState == "complete" && !answerSent) {
                answerSent = true;
                const type = {
                    'type': 'answer',
                    'familyType': familyType
                };
                sendNegotiation(type, pcRemote.localDescription, player.name, remote);
            }
        };

        let offerDesc = new RTCSessionDescription(offer);
        let sdpConstraints = {
            'mandatory': {
                'OfferToReceiveAudio': false,
                'OfferToReceiveVideo': false
            }
        };
        pcRemote.setRemoteDescription(offerDesc);
        pcRemote.createAnswer(function (answerDesc) {
                pcRemote.setLocalDescription(answerDesc);
                console.log("------ SEND ANSWER ------");
            },
            function () {
            },
            sdpConstraints)
    };
    /*
     this.addNeighbor = function(name1,coordonneX1,coordonneY1,radius1,angle1,speed1) {
     var neighbor1;
     neighbor1.namen = name1;
     neighbor1.coordonneX = coordonneX1;
     neighbor1.coordonneY = coordonneY1;
     neighbor1.radius = radius1;
     neighbor1.angle = angle1;
     neighbor1.speed = speed1;

     neighborhood.push(neighbor1);
     };

     this.removeNeighbor = function(name){
     neighborhood.splice(neighborhood.indexOf(name), 1);
     };*/


};

let Player = function (name) {

    this.neighborhood = [];
    this.name = name;
    this.dataChannel = null;
    this.radius = 0;
    this.angle = 0;
    this.speed = 0;
    this.coordonneX = 0;
    this.coordonneY = 0;
    this.rank = 1;
    this.direction = 0;
    this.winner = null;
    this.skin = 'Rouge';

    console.log('Nouvel objet Player créé : ' + name);

    this.setDataChannel = function (dataChannel) {
        this.dataChannel = dataChannel;
    };

    this.getName = function () {
        return name;
    };

    this.sendPosition = function () {
        const data = {
            "name": player.getName(),
            "radius": player.radius,
            "angle": player.angle,
            "x": player.coordonneX,
            "y": player.coordonneY,
            "speed": player.speed,
            "timestamp": player.timestamp,
            "direction": player.direction,
            "type": "position",
            "skin": player.skin
        };
        sendData(data, player.dataChannel);
    };

    this.receiveConnection = function (offer, familyType) {
        let pcRemote = new RTCPeerConnection(cfg, con);
        pcRemote.ondatachannel = function (e) {
            dc2 = e.channel || e;
            dc2.onopen = function () {
                player.setDataChannel(dc2);
                console.log('Connected');
                answerSent = false;
            };
            dc2.onmessage = function (e) {
                let data = JSON.parse(e.data);
                switch (data.message.type) {
                    case "voisinage" :
                        player.neighborhood = data.message.voisinage;
                        player.rank = data.message.classement;
                        break;
                    case "initPosition" :
                        let min = data.message.angleD;
                        let max = data.message.angleF;
                        let angleStart = Math.floor(Math.random() * (max - min + 1)) + min;
                        player.angle = angleStart;
                        player.radius = DIAMETER/2-300;
                        let angleRadian = angleStart * Math.PI / 180;
                        player.coordonneX = player.radius * Math.cos(angleRadian);
                        player.coordonneY = player.radius * Math.sin(angleRadian);
                        console.log(player);
                        break;
                    case "offer" :
                        console.log("switching host from " + remote + " to " + data.message.from);
                        remote = data.message.from;
                        player.receiveConnection(data.message.data, "switchHost");
                        break;
                    case "finishGame":
                        if (data.message.winner == player.name) {
                            player.winner = "winner";
                        } else {
                            player.winner = "looser";
                        }
                        break;
                    default :
                        break;
                }
            }
        };
        pcRemote.onicecandidate = function () {
            if (pcRemote.iceGatheringState == "complete" && !answerSent) {
                answerSent = true;
                const type = {
                    'type': 'answer',
                    'familyType': familyType
                };
                if (familyType == "switchHost") {
                    sendNegotiationSwitchHost('answer', pcRemote.localDescription, player.getName(), remote, player.dataChannel);
                }
                else {
                    sendNegotiation(type, pcRemote.localDescription, player.getName(), remote);
                }
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
};
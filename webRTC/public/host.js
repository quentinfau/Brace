let Host = function (name) {

    console.log('Nouvel objet Host créé : ' + name);
    this.dataChannels = [];
    this.playerList = {};
    this.name = name;
    this.nbJoueur = 1;
    this.indicePremierJoueur = 1;
    this.indiceDernierJoueur = 1;
    this.PHLeftB = null;
    this.PHRightB = null;
    this.PHFather = null;
    this.PHSon1 = null;
    this.PHSon2 = null;

    // Coordonnées zones :

    this.point1 = [1, 1];
    this.point2 = [2, 2];
    this.point3 = [3, 3];
    this.point4 = [4, 4];

    this.timestamp = new Date().getTime();

    this.sendData = function (data) {
        if (data) {
            dataChannels.forEach(function (dataChannel) {
                dataChannel.send(JSON.stringify({message: data, user: parent.name}));
            });
            chatlog.innerHTML += '[' + this.name + '] ' + messageTextBox.value + '</p>';
            messageTextBox.value = "";
        }
        return false
    };

    this.createConnection = function (playerName) {
        return new Promise(function (resolve, reject) {
            pcLocal = new RTCPeerConnection(cfg, con);
            pcLocal.onicecandidate = function () {
                if (pcLocal.iceGatheringState == "complete" && !offerSent) {
                    offerSent = true;
                    sendNegotiation("offer", pcLocal.localDescription, host.name, playerName);
                }
            };
            dc1 = pcLocal.createDataChannel(createID(host.name, playerName), {reliable: true});
            dc1.onopen = function () {
                console.log('Connected');
               // host.addDataChannel(dc1);
                let data = {user: "system", message: "the datachannel " + dc1.label + " has been opened"};
                writeMsg(data);
                offerSent = false;
                resolve(dc1);
            };
            dc1.onmessage = function (e) {
                if (e.data.charCodeAt(0) == 2) {
                    return
                }

                let data = JSON.parse(e.data);
                switch (data.type) {
                    case "position" :
                        writeMsg(data);
                        break;
                    default :
                        break;
                }
                writeMsg(data);
            };
            dc1.onerror = function (e) {
                reject(e)
            };
            pcLocal.createOffer(function (desc) {
                pcLocal.setLocalDescription(desc, function () {
                }, function () {
                });
                console.log("------ SEND OFFER ------");

            }, function () {
            }, sdpConstraints);
        });
    };

    this.setList = function (playerList) {
        this.playerList = playerList;
    };

    this.addDataChannel = function (dataChannel) {
        this.dataChannels.push(dataChannel);
    };

    this.removeDataChannel = function (dataChannel) {
        this.dataChannels.splice(dataChannel);
    };

    this.setPHRightB = function (PHRightB) {
        this.PHRightB = PHRightB;
    };

    this.setPHLeftB = function (PHLeftB) {
        this.PHLeftB = PHLeftB;
    };

    this.setPHFather = function (PHFather) {
        this.PHFather = PHFather;
    };

    this.setPHSon1 = function (PHSon1) {
        this.PHSon1 = PHSon1;
    };

    this.setPHSon2 = function (PHSon2) {
        this.PHSon2 = PHSon2;
    };

    this.getPHRightB = function () {
        return PHRightB;
    };

    this.getPHLeftB = function () {
        return PHLeftB;
    };

    this.getPHFather = function () {
        return PHFather;
    };

    this.getPHSon1 = function () {
        return PHSon1;
    };
    this.getPHSon2 = function () {
        return PHSon2;
    };

    this.setZone = function (point11, point22, point33, point44) {
        point1 = point11;
        point2 = point22;
        point3 = point33;
        point4 = point44;
    };

    this.getZone = function () {
        return null;
    };
};

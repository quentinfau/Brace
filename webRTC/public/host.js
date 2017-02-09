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

    this.distanceD = 4000;
    this.distanceF = 8000;
    this.angleD = 0;
    this.angleF = 180;

    this.timestamp = new Date().getTime();

    this.sendData = function (data) {
        if (data) {
            host.dataChannels.forEach(function (dataChannel) {
                dataChannel.send(JSON.stringify({message: data, user: host.name}));
            });
            chatlog.innerHTML += '[' + host.name + '] ' + messageTextBox.value + '</p>';
            messageTextBox.value = "";
        }
        return false
    };

    this.getDataChannelByName = function (idUserDatachannel) {
        host.dataChannels.forEach(function (dataChannel) {
            if (dataChannel.label == idUserDatachannel) {
                return dataChannel;
            }
        });
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
                switch (data.message.type) {
                    case "position" :
                        writeMsg(data);
                        console.log("RECEIVED : " + data.message);
                        let idUserDatachannel = createID(host.name, data.user);
                        let userDatachannel = host.getDataChannelByName(idUserDatachannel);
                        const data2 = {
                            "classement": 0,
                            "voisinage": "voisinage"
                        };
                        host.sendData(data2, userDatachannel);
                        writeMsg(data2);
                        break;
                    /*case "position" :
                     writeMsg(data);
                     break;*/
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

    this.setZone = function (dist1, dist2, angle1, angle2) {
        this.distanceD = dist1;
        this.distanceF = dist2;
        this.angleD = angle1;
        this.angleF = angle2;
    };

    this.getZone = function () {
        return null;
    };

};

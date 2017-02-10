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

    this.distanceD = 0;
    this.distanceF = 8000;

    this.angleD = 0;
    this.angleF = 360;

    this.timestamp = new Date().getTime();

    this.sendData = function (data, dataChannel) {
        if (data && dataChannel) {
                dataChannel.send(JSON.stringify({message: data, user: host.name}));

            chatlog.innerHTML += '[' + host.name + '] ' + messageTextBox.value + '</p>';
            messageTextBox.value = "";
        };
        return false;
    };

    this.getDataChannelByName = function (nameUserDatachannel) {
        let temp;
        host.dataChannels.forEach(function (dataChannel) {
            if (dataChannel.label == nameUserDatachannel) {
                temp =  dataChannel;
            }
        });
        return temp;
    };

    this.createConnection = function (playerName, familyType) {
        return new Promise(function (resolve, reject) {
            if (playerName != null && playerName != "") {

                pcLocal = new RTCPeerConnection(cfg, con);
                pcLocal.onicecandidate = function () {
                    if (pcLocal.iceGatheringState == "complete" && !offerSent) {
                        offerSent = true;
                        const type = {
                            'type': 'offer',
                            'familyType': familyType
                        };
                        sendNegotiation(type, pcLocal.localDescription, host.name, playerName);
                    }
                };
                dc1 = pcLocal.createDataChannel(createID(host.name, playerName), {reliable: true});
                dc1.onopen = function () {
                    console.log('Connected');
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
                            host.verifSwitchHost(data.message.radius, data.message.angle, playerName);
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
                });
                pcLocal.createOffer(function (desc) {
                    pcLocal.setLocalDescription(desc, function () {
                    }, function () {
                    });
                    console.log("------ SEND OFFER ------");

                }, function () {
                }, sdpConstraints);
            }
            else {
                resolve("player name is empty");
            }
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

    this.addPlayerList = function (player1) {
        this.playerList.push(player1);
    };

    this.removePlayerList = function (player1) {
        this.playerList.splice(player1);
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

    this.switchToHost = function (host2, player) {
        host.dataChannels.forEach(function (dataChannel) {
            let dc = host.getDataChannelByName(player);
            if (dc) {
                host.removeDataChannel(dc);
                host.removePlayerList(player);
                host2.createConnection(player);
                host2.addPlayerList(player);
            }
        });
        console.log("BlouBlou");
        return false
    };

    this.verifSwitchHost = function (angle1, distance1, player) {

        if (distance1 < host.distanceD) {
            host.switchToHost(host.PHFather, player);
        }
        else if (distance1 > host.distanceF) {
            let SumAngle = host.angleD + host.angleF;
            SumAngle = SumAngle / 2;
            if (SumAngle > angle1) {
                host.switchToHost(host.PHSon1, player);
            }
            else if (SumAngle < angle1) {
                host.switchToHost(host.PHSon2, player);
            }
        }
        else if (angle1 > host.angleF) {
            host.switchToHost(host.PHLeft, player);
        }
        else if (angle1 < host.angleD) {
            host.switchToHost(host.PHRight, player);
        }
    }
};

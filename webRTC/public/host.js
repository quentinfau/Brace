let Host = function (name) {

    console.log('Nouvel objet Host créé : ' + name);
    this.dataChannels = [];
    this.playerList = {};
    this.waitingChangingHostList = [];
    this.name = name;
    this.nbJoueur = 1;
    this.indicePremierJoueur = 1;
    this.indiceDernierJoueur = 1;
    this.PHLeftB = null;
    this.PHRightB = null;
    this.PHFather = null;

    this.PHSon1 = null;
    this.PHSon2 = null;
    
    this.neighbours = [];
    
       
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
        }
        return false;
    };

    this.getDataChannelByName = function (nameUserDatachannel) {
        let temp;
        host.dataChannels.forEach(function (dataChannel) {
            if (dataChannel.label == nameUserDatachannel) {
                temp = dataChannel;
            }
        });
        return temp;
    };

    this.createConnection = function (playerName, familyType, dataChannel) {
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
                        if (familyType == "switchHost") {
                            sendNegotiationSwitchHost('offer', pcLocal.localDescription, host.name, playerName, dataChannel);
                        }
                        else {
                            sendNegotiation(type, pcLocal.localDescription, host.name, playerName);
                        }
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
                            host.getNeighbours(data.message);
                            const data2 = {
                                "classement": 0,
                                "voisinage": host.neighbours,
                                "type": "voisinage"
                            };
                            host.sendData(data2, userDatachannel);
                            writeMsg(data2);
                            if (!host.waitingChangingHostList.includes(playerName)) {
                                host.verifSwitchHost(data.message.radius, data.message.angle, playerName);
                            }
                            break;
                        case "connection" :
                            host.createConnection(data.message.player, "switchHost", host.getFamilyDataChannelByName(data.message.host))
                                .then(dataChannel => {
                                    console.log("dataChannel : " + dataChannel + ' player : ' + remote);
                                    host.addDataChannel(dataChannel);
                                });
                            break;
                        case "offer" :
                            sendData(data.message, host.getDataChannelByName(createID(host.name, data.message.to)));
                            break;
                        case "answer" :
                            if (data.message.to != host.name) {
                                sendData(data.message, host.getFamilyDataChannelByName(data.message.to));
                                host.removeDataChannel(host.getDataChannelByName(createID(host.name, data.message.from)));
                                host.waitingChangingHostList.splice(host.waitingChangingHostList.indexOf(data.message.from));
                            }
                            else {
                                processAnswer(data.message.data);
                            }
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
            }
            else {
                resolve("player name is empty");
            }
        });
    };

    this.receiveConnectionHost = function (offer, familyType) {
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
                    case "offer" :
                        sendData(data.message, host.getDataChannelByName(createID(host.name, data.message.to)));
                        break;
                   /* case "answer" :
                        if (data.message.to != host.name) {
                            sendData(data.message, host.getFamilyDataChannelByName(data.message.to));
                            host.removeDataChannel(host.getDataChannelByName(createID(host.name, data.message.from)));
                            host.waitingChangingHostList.splice(host.waitingChangingHostList.indexOf(data.message.from));
                        }
                        else {
                            processAnswer(data.message.data);
                        }
                        break;*/
                    default :
                        writeMsg(data);
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
                    sendNegotiationSwitchHost('answer', pcRemote.localDescription, player.name, remote, player.dataChannel);
                }
                else {
                    sendNegotiation(type, pcRemote.localDescription, player.name, remote);
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
        return this.PHRightB;
    };

    this.getPHLeftB = function () {
        return this.PHLeftB;
    };

    this.getPHFather = function () {
        return this.PHFather;
    };

    this.getPHSon1 = function () {
        return this.PHSon1;
    };
    this.getPHSon2 = function () {
        return this.PHSon2;
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
    

    this.getFamilyDataChannelByName = function (name) {
        let dataChannel;
        if (host.getPHFather() != null && host.getRemote(host.getPHFather().label) == name) {
            dataChannel = host.getPHFather();
        }
        else if (host.getPHLeftB() != null && host.getRemote(host.getPHLeftB().label) == name) {
            dataChannel = host.getPHLeftB();
        }
        else if (host.getPHRightB() != null && host.getRemote(host.getPHRightB().label) == name) {
            dataChannel = host.getPHRightB();
        }
        else if (host.getPHSon1() != null && host.getRemote(host.getPHSon1().label) == name) {
            dataChannel = host.getPHSon1();
        }
        else if (host.getPHSon2() != null && host.getRemote(host.getPHSon2().label) == name) {
            dataChannel = host.getPHSon2();
        }
        return dataChannel
    };

    this.getRemote = function (label) {
        res = label.split("-");
        return res[0] == host.name
            ? res[1]
            : res[0]
    };

    this.switchToHost = function (newHostDataChannel, player, familyType) {
        console.log("switching host of " + player + " to " + familyType);
        host.waitingChangingHostList.push(player);
        const data = {
            "type": "connection",
            "player": player,
            "familyType": familyType,
            "host": host.name
        };
        sendData(data, newHostDataChannel);
        /*
         host.dataChannels.forEach(function (dataChannel) {
         let dc = host.getDataChannelByName(player);
         if (dc) {
         host.removeDataChannel(dc);
         host.removePlayerList(player);
         newHost.createConnection(player);
         newHost.addPlayerList(player);
         }
         });*/
        console.log("BlouBlou");
        return false
    };

    this.verifSwitchHost = function (angle1, distance1, player) {
        if (distance1 < host.distanceD) {
            host.switchToHost(host.PHFather, player, "PHFather");
        }
        else if (distance1 > host.distanceF) {
            let SumAngle = host.angleD + host.angleF;
            SumAngle = SumAngle / 2;
            if (SumAngle > angle1) {
                host.switchToHost(host.PHSon1, player, "PHSon1");
            }
            else if (SumAngle < angle1) {
                host.switchToHost(host.PHSon2, player, "PHSon2");
            }
        }
        else if (angle1 > host.angleF) {
            host.switchToHost(host.PHLeftB, player, "PHLeftB");
        }
        else if (angle1 < host.angleD) {
            host.switchToHost(host.PHRightB, player, "PHRightB");
        }
    }
    
    this.getNeighbours = function (dataMessage) {
    	let neighbourData = {
	    	'name': dataMessage.name,
	    	'radius': dataMessage.radius,
	    	'angle': dataMessage.angle,
	    	'x': dataMessage.x,
	    	'y': dataMessage.y,
	    	'speed': dataMessage.speed
        }
    	trouve = 0;
    	i=0;
    	if(host.neighbours.length != 0) {
	        host.neighbours.forEach(function (neighbour) {
	            if(neighbour.name == dataMessage.name) {
	            	host.neighbours[i] = neighbourData;  	
	            	trouve = 1;
	            }
	            i++;
	        });
    	}
        if(trouve == 0) {
        	host.neighbours.push(neighbourData);
        }
    };
    
    this.initPositionPlayer = function() {
    	host.playerList.forEach( function(player) {
    		let dataChannel = host.getDataChannelByName(createID(host.name, player));
    		const data = {
                "angleD": host.angleD,
                "angleF": host.angleF,
                "type": "initPosition"
            };
    		host.sendData(data,dataChannel);
    	});
    }

};
connectToRemote.onclick = function () {
    host.switchToHost(host.PHLeftB, "1", "PHLeftB");
};
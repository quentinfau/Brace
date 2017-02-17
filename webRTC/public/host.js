let Host = function (name) {

    console.log('Nouvel objet Host créé : ' + name);
    this.dataChannels = [];
    this.playerList = {};
    this.waitingChangingHostList = [];
    this.name = name;
    this.timeoutSwitchingHost = null;
    this.timeoutOfferSent = null;
    this.PHLeftB = null;
    this.PHRightB = null;
    this.PHFather = null;
    this.PHSon1 = null;
    this.PHSon2 = null;
    this.god = false;
    this.neighbours = [];


    //Classement
    let dataL = null;
    let dataR = null;
    let classement = [];

    // Coordonnées zones :

    this.distanceD = 0;
    this.distanceF = 8000;
    this.angleD = 0;
    this.angleF = 360;
    this.timestamp = new Date().getTime();

    this.getDataChannelByName = function (nameUserDatachannel) {
        let temp = null;
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
                    console.log("offerSent = " + offerSent);
                    if (pcLocal.iceGatheringState == "complete" && !offerSent) {
                        offerSent = true;
                        host.timeoutOfferSent = setTimeout(function () {
                            host.offerSent = false;
                        }, 10000);

                        const type = {
                            'type': 'offer',
                            'familyType': familyType
                        };
                        if (familyType == "switchHost") {
                            sendNegotiationSwitchHost('offer', pcLocal.localDescription, host.getName(), playerName, dataChannel);
                        }
                        else {
                            sendNegotiation(type, pcLocal.localDescription, host.getName(), playerName);
                        }
                    }
                };
                dc1 = pcLocal.createDataChannel(createID(host.getName(), playerName), {reliable: true});
                dc1.onopen = function () {
                    if (familyType == "switchHost") {
                        if (pcLocal.iceConnectionState == "completed") {
                            console.log("sending to " + remote + " that the connection was successful");
                            const data = {
                                "type": "connectionSuccessful",
                                "from": host.getRemote(dc1.label)
                            };
                            sendData(data, host.getFamilyDataChannelByName(remote));
                        }
                        else if (pcLocal.iceConnectionState == "failed") {
                            console.log("sending to " + remote + " that the connection failed");
                        }
                    }
                    console.log('Connected');
                    offerSent = false;
                    clearTimeout(host.timeoutOfferSent);
                    resolve(dc1);
                };
                dc1.onmessage = function (e) {
                    let data = JSON.parse(e.data);
                    switch (data.message.type) {
                        case "position" :
                            console.log("RECEIVED : " + data.message);
                            let idUserDatachannel = createID(host.getName(), data.user);
                            let userDatachannel = host.getDataChannelByName(idUserDatachannel);
                            if (userDatachannel != null && userDatachannel.readyState == "open") {
                                host.getNeighbours(data.message);

                                let position = host.GetClassementByPlayer(host.classement, data.user)

                                const data2 = {
                                    "classement": position,
                                    "voisinage": host.neighbours,
                                    "type": "voisinage"
                                };
                                sendData(data2, userDatachannel);
                            }
                            else {
                                console.warn("the dataChannel " + idUserDatachannel + "is null or not in open state");
                            }
                            if (host.waitingChangingHostList.length == 0) {
                                host.verifSwitchHost(data.message.angle, data.message.radius, playerName);
                            }
                            break;
                        case "connection" :
                            host.processConnectionMessage(data);
                            break;
                        case "offer" :
                            host.processOfferMessage(data);
                            break;
                        case "answer" :
                            host.processAnswerMessage(data);
                            break;
                        case "connectionSuccessful" :
                            host.processConnectionSuccessfulMessage(data);
                            break;
                        case "classement" :
                        if(e.target == host.PHSon1)
                        {
                            host.dataL = data.message.data;
                        }

                        if(e.target == host.PHSon2)
                        {
                            host.dataR = data.message.data;
                        }
                        let dataLR = [];
                        if(host.dataR != null && host.dataL != null)
                        {
                            dataLR = host.dataL.concat(host.dataR);
                            dataLR.sort(host.comparePlayers);


                        let dataSend = [];
                        if(host.god)
                        {
                        host.classement = dataLR;
                        host.sendClassement(dataLR, host.PHSon1);
                        host.sendClassement(dataLR, host.PHSon2);
                        }
                        else
                        {
                        let dataF = [];
                          if(host.getPlayersCount() != 0)
                             dataF.push(new Classement(host.getFirstPlayer(),host.name,host.getPlayersCount()));
                          if(host.getPlayersCount() != 0)
                             dataF.push(new Classement(host.getLastPlayer(),host.name,host.getPlayersCount()));

                        data = dataLR.concat(dataF);
                        data.sort(host.comparePlayers);

                        host.sendClassement(data, host.PHFather);
                        host.dataR = null;
                        host.dataL = null;
                        }
                        }
                        break;
                        default :
                            break;
                    }
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
                    offerSent = false;
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
                answerSent = false;
            };
            dc2.onmessage = function (e) {
                let data = JSON.parse(e.data);
                switch (data.message.type) {
                    case "connection" :
                        host.processConnectionMessage(data);
                        break;
                    case "offer" :
                        host.processOfferMessage(data);
                        break;
                    case "answer" :
                        host.processAnswerMessage(data);
                        break;
                    case "connectionSuccessful" :
                        host.processConnectionSuccessfulMessage(data);
                        break;
                    case "finishGame" :
                        host.endGame(host.PHSon1);
                        host.endGame(host.PHSon2);
                        host.sendToPlayerList(data.message.winner);
                        break;
                    case "getClassement" :
                            let classementTransfer = [];
                            if(host.PHSon1 != null && host.PHSon2 != null)
                            {
                                host.getClassement(host.PHSon1);
                                host.getClassement(host.PHSon2);
                                console.log("I want a classement !");
                            }
                            else
                            {
                                console.log("I have no son... :'-(");
                                if(host.getPlayersCount() != 0)
                                    classementTransfer.push(new Classement(host.getFirstPlayer(),host.name,host.getPlayersCount()));
                                if(host.getPlayersCount() != 0)
                                    classementTransfer.push(new Classement(host.getLastPlayer(),host.name,host.getPlayersCount()));

                                // Suppression des doublons pour les cas où le premier et le dernier joueur sont le même joueur (un joueur dans la zone)
                                var cache = {};
                                classementTransfer = classementTransfer.filter(function(elem,index,array){
                                    return cache[elem.player.name]?0:cache[elem.player.name]=1;
                                });
                                host.sendClassement(classementTransfer, host.PHFather);
                            }
                            break;
                    case "classement" :
                        host.classement = data.message.data;
                        if(host.PHSon1 != null && host.PHSon2 != null)
                        {
                        host.sendClassement(data.message.data, host.PHSon1)
                        host.sendClassement(data.message.data, host.PHSon2)
                        }
                    break;
                    default :
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

    this.setList = function (playerList) {
        this.playerList = playerList;
    };

    this.addDataChannel = function (dataChannel) {
        this.dataChannels.push(dataChannel);
    };

    this.removeDataChannel = function (dataChannel) {
        this.dataChannels.splice(this.dataChannels.indexOf(dataChannel), 1);
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
    this.getName = function () {
        return this.name;
    };

    this.setZone = function (dist1, dist2, angle1, angle2) {
        this.distanceD = dist1;
        this.distanceF = dist2;
        this.angleD = angle1;
        this.angleF = angle2;
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
        return res[0] == host.getName()
            ? res[1]
            : res[0]
    };

    this.switchToHost = function (newHostDataChannel, player, familyType) {
        console.log("switching host of " + player + " to " + familyType);
        host.waitingChangingHostList.push(player);
        host.timeoutSwitchingHost = setTimeout(host.removePlayerFromWaitingList, 10000, player);
        const data = {
            "type": "connection",
            "player": player,
            "familyType": familyType,
            "host": host.getName()
        };
        sendData(data, newHostDataChannel);
    };

    this.verifSwitchHost = function (angle1, distance1, player) {
        console.log("angle1 = " + angle1 + " angleF = " + host.angleF + " angleD = " + host.angleD + " distance " + distance1);
        if (distance1 < host.distanceD) {
            host.switchToHost(host.PHFather, player, "PHFather");
        }
        else if (distance1 > host.distanceF) {
            let SumAngle = host.angleD + host.angleF;
            SumAngle = SumAngle / 2;
            if (SumAngle > angle1) {
                if (host.PHSon1 != null) {
                    host.switchToHost(host.PHSon1, player, "PHSon1");
                }
            }
            else if (SumAngle < angle1) {
                if (host.PHSon2 != null) {
                    host.switchToHost(host.PHSon2, player, "PHSon2");
                }
            }
        }
        else if (host.angleF != 360 && angle1 > host.angleF && host.angleD != 0) {
            console.log("left");
            host.switchToHost(host.PHLeftB, player, "PHLeftB");
        }
        else if (host.angleF == 360 && angle1 < (host.angleF - host.angleD)) {
            console.log("left");
            host.switchToHost(host.PHLeftB, player, "PHLeftB");
        }
        else if (host.angleF != 360 && angle1 < host.angleD) {
            console.log("right");
            host.switchToHost(host.PHRightB, player, "PHRightB");
        }
        else if (host.angleD == 0 && angle1 > (360 - host.angleF) && angle1 > host.angleF) {
            console.log("right");
            host.switchToHost(host.PHRightB, player, "PHRightB");
        }
        else if (host.angleF == 360 && angle1 < host.angleD) {
            console.log("right");
            host.switchToHost(host.PHRightB, player, "PHRightB");
        }
        else if (host.angleD == 0 && angle1 < (360 - host.angleF) && angle1 > host.angleF) {
            console.log("left");
            host.switchToHost(host.PHLeftB, player, "PHLeftB");
        }
    };

    this.getNeighbours = function (dataMessage) {
        let neighbourData = {
            'name': dataMessage.name,
            'radius': dataMessage.radius,
            'angle': dataMessage.angle,
            'x': dataMessage.x,
            'y': dataMessage.y,
            'speed': dataMessage.speed,
            'direction': dataMessage.direction,
            'skin': dataMessage.skin
        };
        trouve = 0;
        i = 0;
        if (host.neighbours.length != 0) {
            host.neighbours.forEach(function (neighbour) {
                if (neighbour.name == dataMessage.name) {
                    host.neighbours[i] = neighbourData;
                    trouve = 1;
                }
                i++;
            });
        }
        if (trouve == 0) {
            host.neighbours.push(neighbourData);
        }
    };

    this.initPositionPlayer = function () {
        host.playerList.forEach(function (player) {
            let dataChannel = host.getDataChannelByName(createID(host.getName(), player));
            const data = {
                "angleD": host.angleD,
                "angleF": host.angleF,
                "type": "initPosition"
            };
            sendData(data, dataChannel);
        });
    };

    this.processOfferMessage = function (data) {
        sendData(data.message, host.getDataChannelByName(createID(host.getName(), data.message.to)));
    };

    this.processAnswerMessage = function (data) {
        if (data.message.to != host.getName()) {
            sendData(data.message, host.getFamilyDataChannelByName(data.message.to));
            host.neighbours.splice(host.neighbours.indexOf(data.message.from));
            offerSent = false;
            clearTimeout(host.timeoutOfferSent);
        }
        else {
            remote = data.user;
            finalizeConnection(data.message.data);
            offerSent = false;
            clearTimeout(host.timeoutOfferSent);
        }
    };

    this.processConnectionSuccessfulMessage = function (data) {
        host.removeDataChannel(host.getDataChannelByName(createID(host.getName(), data.message.from)));
        host.waitingChangingHostList.splice(host.waitingChangingHostList.indexOf(data.message.from));
        clearTimeout(host.timeoutSwitchingHost);
    };

    this.processConnectionMessage = function (data) {
        if (!host.god) {
            host.createConnection(data.message.player, "switchHost", host.getFamilyDataChannelByName(data.message.host))
                .then(dataChannel => {
                    console.log("dataChannel : " + dataChannel + ' player : ' + remote);
                    host.addDataChannel(dataChannel);
                });
        }
        else {
            console.log(data.message.player + " won the game");
            host.endGame(host.PHSon1, data.message.player);
            host.endGame(host.PHSon2, data.message.player);
        }
    };

    this.endGame = function (PHSon, winner) {
        const data = {
            "winner": winner,
            "type": "finishGame"
        };
        if (PHSon != null) {
            sendData(data, PHSon);
        }
    };

    this.sendToPlayerList = function (winner) {
        host.dataChannels.forEach(function (dataChannel) {
            const data = {
                "winner": winner,
                "type": "finishGame"
            };
            sendData(data, dataChannel);
        });
    };

    this.getClassement = function (DataChannel)
        {
            const data = {
                "type": "getClassement"
            }
            sendData(data, DataChannel)
        }
        this.sendClassement = function (data, DataChannel)
        {
            const post = {
               "type": "classement",
               "data": data
            }
            sendData(post, DataChannel)
        }
    var timer = setInterval(initClassement, 5000);

    function initClassement(){
        if(host.god)
        {
            if(host.PHSon1!= null & host.PHSon2 != null)
            {
                host.getClassement(host.PHSon1);
                host.getClassement(host.PHSon2);
                console.log("GOD send a message")
            }
        }
    }

    this.getFirstPlayer = function(){
        	let min = 250000;
        	let first = null;
        	for (let p of host.neighbours)
        	{
        		if(p.radius < min) {
        			min = p.radius;
        			first = p;
        		}
        	}

        	return first;
        };

    this.removePlayerFromWaitingList = function (player) {
        if (host.waitingChangingHostList[0] == player) {
            host.waitingChangingHostList.splice(host.waitingChangingHostList.indexOf(player));
        }
    }

        /**
         * Récupération du dernier joueur
         */
        this.getLastPlayer = function(){
        	let max = -1;
        	let last = null;
        	for (let p of this.neighbours)
        	{
        		if(p.radius > max) {
        			max = p.radius;
        			last = p;
        		}
        	}

        	return last;
        };

        this.getPlayersCount = function(){
            	return host.neighbours.length;
            };

        this.comparePlayers = function(a,b) {
            	return a.player.radius-b.player.radius;
            };

        this.GetClassementByPlayer = function(data, playerName) {
        	let top=null;
        	let topClass;
        	let bottom=null;
        	let bottomClass;

        	for (var i=0; i <= data.length-1; i++)
        	{
        		if(top==null && data[i].zone==host.name) {
        			top = data[i].player.radius;
        			topClass = i+1;
        		}
        		if(top!=null && data[i].zone==host.name) {
        			bottom = data[i].player.radius;
        			bottomClass = i+1;
        		}
        	}

            return (this.generateClassementPlayer(topClass, bottomClass, data.length, playerName));
        };

        this.generateClassementPlayer = function(topId, bottomId, size, playerName){
            	let ax = 1;
            	let ay;
            	if(topId==1) {
            		ay=1;
            	} else {
                	ay = topId*100/size | 0;
            	}
            	let bx = host.getPlayersCount();
            	let by = bottomId*100/size | 0;
            	let position;
            	//console.log("ax:" + ax + "_ay:" + ay + "_bx:" + bx + "_by:" + by);
            	let fctA = (by-ay)/(bx-ax) | 0;
            	let fctB = by-fctA*bx | 0;
            	host.neighbours.sort(function(a, b){return a.radius-b.radius});
            	for(var i=0; i <= host.neighbours.length-1; i++) {
                    if(host.neighbours[i].name == playerName)
                    {
                        position = (i+1)*fctA + fctB | 0; // FONCTION AFFINE
                    }
            	}
            	return position
            };
            }

let Classement = function(p,z,c) {
	this.player=p;
	this.zone=z;
	this.count=c;
}

function connectToWebSocket(name) {

    socket = io.connect(location.origin);
    socket.emit('new_player', name);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
    });
    socket.on('errorMessage', function (data) {
        console.log("received error message from the server : " + data.message);
    });
    socket.on('createHost', function (user) {
        host = new Host(user);
    });
    socket.on('createPlayer', function (user) {
        player = new Player(user);
    });
    socket.on('initPlayerHost', function (data) {
        const msg = JSON.parse(data);
        host.setList(msg.playerList);
        host.family = msg.family;
        if(host.family.PHFather=="god"){
            host.god = true;
        }
        host.setZone(msg.zone.distanceD,msg.zone.distanceF,msg.zone.angleD,msg.zone.angleF);
        initHost(host, 0);
    });
    socket.on('initPlayerPosition', function () {
       host.initPositionPlayer();
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action.type == "offer") {
            if (data.to == player.getName()) {
                remote = data.from;
                if (data.action.familyType==null){
                    player.receiveConnection(data.data, data.action.familyType);
                }
                else {
                    host.receiveConnectionHost(data.data,data.action.familyType)
                }
            }
        } else if (data.action.type == "answer") {
            if (data.to == player.getName()) {
                finalizeConnection(data.data);
            }
        }
    });
}

function initHost(host, i) {
    let currentPlayer = host.playerList[i];
    if (currentPlayer != null) {
        remote = currentPlayer;
        host.createConnection(remote)
            .then(dataChannel => {
                console.log("dataChannel : " + dataChannel + ' player : ' + remote);
                host.addDataChannel(dataChannel);
                initHost(host, i + 1);
            })
    }
    else {
        initHostFamily(host);
    }
}
function initHostFamily(host) {
    host.createConnection(host.family.PHRightB, "PHRightB")
        .then(dataChannel => {
            console.log("dataChannel : " + dataChannel + ' player : ' + remote);
            if (dataChannel instanceof RTCDataChannel) {
                host.setPHRightB(dataChannel);
            }
            host.createConnection(host.family.PHSon1, "PHSon1")
                .then(dataChannel => {
                    console.log("dataChannel : " + dataChannel + ' player : ' + remote);
                    if (dataChannel instanceof RTCDataChannel) {
                        host.setPHSon1(dataChannel);
                    }
                    host.createConnection(host.family.PHSon2, "PHSon2")
                        .then(dataChannel => {
                            console.log("dataChannel : " + dataChannel + ' player : ' + remote);
                            if (dataChannel instanceof RTCDataChannel) {
                                host.setPHSon2(dataChannel);
                            }
                            console.log("host " + host.getName() + " finished the init method ");
                            socket.emit("initHostOver", host.getName());
                        })
                })
        });
}
startGame.onclick = function () {
    console.log("socket emit startGame");
    socket.emit('startGame');
    //window.location = "index_Brace.html";
};

setid.onclick = function () {
    let name = $("#user").val();
    connectToWebSocket(name);
    return false;
};

function connectToWebSocket(name) {

    socket = io.connect(location.origin);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
        writeMsg(data);
    });
    /*  socket.on('listOfClient', function (list) {
     updateList(list);
     });*/
    socket.on('initPlayerHost', function (data) {
        const msg = JSON.parse(data);
        player = new Player(msg.user);
        host = new Host(msg.user);
        host.setList(msg.playerList);
        host.family = msg.family;
        initHost(host, 0);
    //    initHostFamily(host);
    });
    socket.on('initPlayer', function (user) {
        player = new Player(user);
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action == "offer") {
            remote = data.from;
            player.receiveConnection(data.data);
        } else if (data.action == "answer") {
            if (data.to == player.name) {
                processAnswer(data.data, data.id);
            }
        }
    });
    socket.emit('nouveau_client', name);
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
}
function initHostFamily(host) {
    host.createConnection(host.family.PHFather)
        .then(dataChannel => {
            console.log("dataChannel : " + dataChannel + ' player : ' + remote);

                host.setPHFather(dataChannel);

            host.createConnection(host.family.PHLeftB)
                .then(dataChannel => {
                    console.log("dataChannel : " + dataChannel + ' player : ' + remote);

                        host.setPHLeftB(dataChannel);

                    host.createConnection(host.family.PHRightB)
                        .then(dataChannel => {
                            console.log("dataChannel : " + dataChannel + ' player : ' + remote);

                                host.setPHRightB(dataChannel);

                            host.createConnection(host.family.PHSon1)
                                .then(dataChannel => {
                                    console.log("dataChannel : " + dataChannel + ' player : ' + remote);

                                        host.setPHSon1(dataChannel);

                                    host.createConnection(host.family.PHSon2)
                                        .then(dataChannel => {
                                            console.log("dataChannel : " + dataChannel + ' player : ' + remote);

                                                host.setPHSon2(dataChannel);

                                        })
                                })
                        })
                })
        })
}
startGame.onclick = function () {
    socket.emit('startGame');
    //window.location = "index_Brace.html";
};

setid.onclick = function () {
    let name = $("#user").val();
    connectToWebSocket(name);
    return false;
};

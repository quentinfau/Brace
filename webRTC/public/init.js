function connectToWebSocket(name) {

    socket = io.connect(location.origin);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
        writeMsg(data);
    });
    socket.on('listOfClient', function (list) {
        updateList(list);
    });
    socket.on('initPlayerHost', function (user) {
        player = user;
        initHost(player, 0);
    });
    socket.on('initPlayer', function (user) {
        player = user;
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action == "offer") {
            remote = data.from;
            processOffer(data.data);
        } else if (data.action == "answer") {
            if (data.to == name) {
                processAnswer(data.data, data.id);
            }
        }
    });
    socket.emit('nouveau_client', name);
}

function initHost(host, i) {
    let currentPlayer = host.playerList[i];
    if (currentPlayer != null) {
        remote = currentPlayer.name;
        createConnection.call(host, remote).then(state => {
            console.log("state : " + state + ' pmlayer : ' + remote);
            initHost(host, i + 1);
        })
    }
}

startGame.onclick = function () {
    socket.emit('startGame');
};

setid.onclick = function () {
    let name = $("#user").val();
    connectToWebSocket(name);
    return false;
};
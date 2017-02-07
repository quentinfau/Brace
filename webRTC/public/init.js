function connectToWebSocket(user) {

    socket = io.connect(location.origin);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
        data.user = name;
        writeMsg(data);
    });
    socket.on('listOfClient', function (list) {
        updateList(list);
    });
    socket.on('initPlayerHost', function (host) {
        playerHost = host;
        myHost = host;
        isHost = true;
        initHost(playerHost, 0);
    });
    socket.on('initPlayer', function (player) {
        myPlayer = player;
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action == "offer") {
            myHost = data.from;
            // myPlayer = data.to;
            processOffer(data.data);
        } else if (data.action == "answer") {
            if (data.to == user) {
                processAnswer(data.data, data.id);
            }
        }
    });
    socket.emit('nouveau_client', user);
}

function initHost(playerHost, i) {
    let player = playerHost.playerList[i];
    if (player != null) {
        myPlayer = player;
        createConnection.call(playerHost, player).then(state => {
            console.log("state : " + state + ' pmlayer : ' + player);
            initHost(playerHost, i + 1);
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

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
        initHost(host, 0);
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
        .then(state => {
            console.log("state : " + state + ' player : ' + remote);
            initHost(host, i + 1);
        })
    }
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

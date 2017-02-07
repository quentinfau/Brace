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
        initHost();
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

function initHost(){
    playerHost.playerList.forEach(function (player){
        myPlayer = player;
        createConnection.call(playerHost,player);
    });
}
startGame.onclick = function() {
    socket.emit('startGame');
   // myPlayer = new Player("player");
   // createConnection.call(myHost,myPlayer);

};

setid.onclick = function () {
    let name = $("#user").val();
    connectToWebSocket(name);
    return false;
};
function connectToWebSocket(name) {
    let user;
    if (name=="playerHost"){
         user = new PlayerHost(name);
    }
    else {
        user = new Player(name);
    }

    socket = io.connect(location.origin);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
        data.user = name;
        writeMsg(data);
    });
    socket.on('listOfClient', function (list) {
        updateList(list);
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action == "offer") {
            myHost = data.from;
            processOffer(data.data);
        } else if (data.action == "answer") {
            if (data.to == user) {
                processAnswer(data.data, data.id);
            }
        }
    });
    socket.emit('nouveau_client', user);

    if (user instanceof Player){
        createConnection(getAvailableHost(),user);
    }
    else {
        // myPlayer is an host, wait for connection
    }

}

function getAvailableHost(){
return new PlayerHost("playerHost");
}

setid.onclick = function () {
    let name = $("#user").val();
    connectToWebSocket(name);
    return false;
};
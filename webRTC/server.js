const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static(__dirname + '/public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io').listen(server);
const socketList = [];
const listPlayers = [];
const listPlayerHosts = [];


io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socketList.push(socket);
    const welcomeMessage = {
        'message': 'Vous êtes bien connecté !',
        'user': socket.user
    };
    socket.emit('welcomeMessage', welcomeMessage);

    socket.on('nouveau_client', function (pseudo) {
        console.log('nouveau client');
        socket.user = pseudo;
        updateListOfClient();
    });

    socket.on('negotiationMessage', function (data) {
        console.log('Got socket message: ' + data);
        const msg = JSON.parse(data);
        for (let i = 0; i < socketList.length; i++) {
            // send to everybody on the site
            if (socketList[i].user == msg.to) {
                msg.id = socket.id;
                socketList[i].emit('negotiationMessage', msg);
                return;
            }
        }
    });
    
    socket.on('startGame', function (data) {
        console.log('Got socket message: ' + data);
        const msg = JSON.parse(data);
        for (let i = 0; i < socketList.length; i++) {
        	if(i == 0) {
        		var playerHost = new PlayerHost(socketList[i]);
        		listPlayerHosts.push(playerHost);
        	} else {
        		var player = new Player(socketList[i]);
        		listplayers.push(player);
        	}
        	
        	for (let j = 0; j < listPlayers.length; j++) {
        		var id = listPlayerHosts[0].id + "_" + listPlayers[j]
        		
        		var connection = new connection(id, null, null);
        		
        		listPlayerHosts[0].addConnection(connection);
        		listPlayerHosts[0].J.push(listJoueur[j]);
        	}
            // send to everybody on the site
            listPlayerHosts.foreach(function (playerHost){
            	socket.emit("initPlayerHost");           	
            });
            //return;
            //}
        }
    });
    
    socket.on('disconnect', function () {
        socketList.splice(socketList.indexOf(this), 1);
        console.log('Client disconnected');
        updateListOfClient();
    });
});
function updateListOfClient() {
    const userList = [];
    socketList.forEach(function (socket) {
        userList.push(socket.user);
    });
    socketList.forEach(function (socket) {
        socket.emit('listOfClient', userList);
    })
}

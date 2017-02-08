const express = require('express');
const path = require('path');
const math = require('mathjs');

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static(__dirname + '/public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io').listen(server);

const PlayerHost = require("./public/playerHost.js");
const Player = require("./public/player.js");

const socketList = [];
let listPlayer = [];
let listPlayerHost = [];
const listObstacle = [];
const nbZone = 1;
const diametre = 400000;
const nbPlayerByHost = 2;

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

    socket.on('startGame', function () {
    	listPlayerHost = [];
    	listPlayer = [];
        //console.log('Got socket message: ' + data);
        //const msg = JSON.parse(data);
    	for (let i = 0; i < socketList.length; i++) {
            if (i < 2 ) {
                let playerHost = new PlayerHost(socketList[i].user);
                listPlayerHost.push(playerHost);
            } else {
            	initPlayer(socketList[i].user);
            }
        }
                
        listPlayerHost[0].setList(listPlayer.slice(0,2));
        listPlayerHost[1].setList(listPlayer.slice(2,3));

        listPlayer.forEach(function (player) {
            getSocketByName(player.name).emit("initPlayer", player);
        });
        listPlayerHost.forEach(function (playerHost) {
            getSocketByName(playerHost.name).emit("initPlayerHost", playerHost);
        });
    });

    socket.on('disconnect', function () {
        socketList.splice(socketList.indexOf(this), 1);
        let username_disconnected = this.user;

        removePlayerOrPlayerHost(username_disconnected);

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

function removePlayerOrPlayerHost(username_disconnected) {
	let i = 0;
    listPlayerHost.forEach(function (playerHost){
    	if(username_disconnected == playerHost.name) {
    		listPlayerHost.splice(i, 1);
    	}
    	i++;
    });
    i = 0;
    listPlayer.forEach(function (player){
    	if(username_disconnected == player.name) {
    		listPlayer.splice(i, 1);
    	}
    	i++;
    });
}

function getSocketByName(name) {
    for (let i = 0; i < socketList.length; i++) {
        // send to everybody on the site
        if (socketList[i].user == name) {
            return socketList[i];
        }
    }
}

function initPlayer(username) {
	let player = new Player(username);
	let randomAngle = math.randomInt(0,359);
	listPlayer.forEach( function(player_angle) {
		if(player_angle.angle == randomAngle) {
			randomAngle = math.randomInt(0,359);
		}
	});
	player.angle = randomAngle;
	player.radius = 200000;
	player.coordonneX = math.multiply(200000,math.cos(randomAngle));
	player.coordonneY = math.multiply(200000,math.sin(randomAngle));
	listPlayer.push(player);
}


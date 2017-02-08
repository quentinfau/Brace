const express = require('express');
const path = require('path');
const math = require('mathjs');

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static(__dirname + '/public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io').listen(server);

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
        //   updateListOfClient();
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
            name = socketList[i].user;
            if (i < 7) {
                listPlayerHost.push(name);
                initPlayer(name);
            } else {
                initPlayer(name);
            }
        }
        listPlayer.forEach(function (playerName) {
            getSocketByName(playerName).emit("initPlayer", playerName);
        });
        let j = 0;
        for (let i = listPlayerHost.length - 1; i >= 0; i--) {
            if (j<listPlayer.length) {
                initHostWithPlayer(listPlayerHost[i], listPlayer.slice(j, j + 2));
            }
            else {
                initHost(listPlayerHost[i]);
            }
            j=j+2;
        }
    });

    socket.on('disconnect', function () {
        socketList.splice(socketList.indexOf(this), 1);
        let username_disconnected = this.user;

        removePlayerOrPlayerHost(username_disconnected);

        console.log('Client disconnected');
        // updateListOfClient();
    });
});
/*function updateListOfClient() {
 const userList = [];
 socketList.forEach(function (socket) {
 userList.push(socket.user);
 });
 socketList.forEach(function (socket) {
 socket.emit('listOfClient', userList);
 })
 }*/

function removePlayerOrPlayerHost(username_disconnected) {
    let i = 0;
    listPlayerHost.forEach(function (playerHostName) {
        if (username_disconnected == playerHostName) {
            listPlayerHost.splice(i, 1);
        }
        i++;
    });
    i = 0;
    listPlayer.forEach(function (playerName) {
        if (username_disconnected == playerName) {
            listPlayer.splice(i, 1);
        }
        i++;
    });
}

function initHostWithPlayer(host,listPlayer) {
    const data = {
        "playerList": listPlayer,
        "user": host
    };
    getSocketByName(host).emit("initPlayerHost", JSON.stringify(data));
}

function initHost(host) {
    const data = {
        "playerList": "",
        "user": host
    };
    getSocketByName(host).emit("initPlayerHost", JSON.stringify(data));
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
    /*	let player = new Player(username);
     let ramdomAngle = math.randomInt(0,359);
     player.angle = ramdomAngle;
     player.radius = 200000;
     player.coordonneX = math.multiply(200000,math.cos(ramdomAngle));
     player.coordonneY = math.multiply(200000,math.sin(ramdomAngle));*/
    listPlayer.push(username);
}


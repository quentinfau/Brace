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
    const welcomeMessage = {
        'message': 'Vous êtes bien connecté !',
        'user': socket.user
    };
    socket.emit('welcomeMessage', welcomeMessage);

    socket.on('nouveau_client', function (pseudo) {
        console.log('nouveau client');
        socket.user = pseudo;
        socketList.push(socket);
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
        for (let i = 0; i < socketList.length; i++) {
            const name = socketList[i].user;
            if (i < 7) {
                listPlayerHost.push(name);
            }
            initPlayer(name);
        }
        listPlayer.forEach(function (playerName) {
            getSocketByName(playerName).emit("createPlayer", playerName);
        });
        listPlayerHost.forEach(function (playerHostName) {
            getSocketByName(playerHostName).emit("createHost", playerHostName);
        });

        const hostId = listPlayerHost.length - 1;
        initHost(listPlayerHost[hostId], getSubListPlayer(hostId));
    });

    socket.on("initHostOver", function (name) {
        const hostId = listPlayerHost.indexOf(name) - 1;
        if (hostId >= 0) {
            initHost(listPlayerHost[hostId], getSubListPlayer(hostId));
        }
    });

    socket.on('disconnect', function () {
        socketList.splice(socketList.indexOf(this), 1);
        let username_disconnected = this.user;
        removePlayerOrPlayerHost(username_disconnected);
        console.log('Client disconnected');
    });
});

function getSubListPlayer(idHost) {
    const reverseId = listPlayerHost.length - idHost - 1;
    return listPlayer.slice(reverseId * 2, reverseId * 2 + 2);
}

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

function initHost(host, listPlayer) {
    let family = getFamily(host);
    const data = {
        "playerList": listPlayer,
        "user": host,
        "family": family
    };
    getSocketByName(host).emit("initPlayerHost", JSON.stringify(data));
}


function getFamily(host) {
    switch (host) {
        case '1' :
            return {
                "PHLeftB": "",
                "PHRightB": "",
                "PHFather": "",
                "PHSon1": listPlayer[1],
                "PHSon2": listPlayer[2]
            };
            break;
        case '2' :
            return {
                // "PHLeftB": listPlayer[2],
                "PHRightB": listPlayer[2],
                // "PHFather": listPlayer[0],
                "PHSon1": listPlayer[3],
                "PHSon2": listPlayer[4]
            };
            break;
        case '3' :
            return {
                // "PHLeftB": listPlayer[1],
                "PHRightB": listPlayer[1],
                //"PHFather": listPlayer[0],
                "PHSon1": listPlayer[5],
                "PHSon2": listPlayer[6]
            };
            break;
        case '4' :
            return {
                "PHRightB": listPlayer[4],
                "PHSon1": "",
                "PHSon2": ""
            };
            break;
        case '5' :
            return {
                "PHRightB": listPlayer[5],
                "PHSon1": "",
                "PHSon2": ""
            };
            break;
        case '6' :
            return {
                "PHRightB": listPlayer[6],
                "PHSon1": "",
                "PHSon2": ""
            };
            break;
        case '7' :
            return {
                "PHRightB": listPlayer[3],
                "PHSon1": "",
                "PHSon2": ""
            };
            break;
    }
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


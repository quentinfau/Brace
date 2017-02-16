const express = require('express');
const path = require('path');

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
const nbJoueurMax = 8;
let firstPlayer = 0;

io.sockets.on('connection', function (socket) {
    console.log('User connected to server !');
    const welcomeMessage = {
        'message': 'The server received your connection request!',
        'user': socket.user
    };
    socket.emit('welcomeMessage', welcomeMessage);

    socket.on('new_player', function (name) {
        console.log('new player request with name : ' + name);
        if (isUnique(name)) {
            socket.user = name;
            socketList.push(socket);
            if(firstPlayer == 0) {
            	socket.emit('firstPlayerStart');
            	firstPlayer = 1;
            } else {
            	if(socketList.length == nbJoueurMax) {
            		socketList[0].emit('nbPlayerReadyToStart');
            	}
            }
            console.log('player registered : ' + name);
        }
        else {
            const errorMessage = {
                'message': 'the name is already used',
                'user': name
            };
            console.log('the name is already used  : ' + name);
            socket.emit('errorMessage', errorMessage);
        }

    });

    socket.on('negotiationMessage', function (data) {
        console.log('Got socket message: ' + data);
        const msg = JSON.parse(data);
        for (let i = 0; i < socketList.length; i++) {
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
        console.log("startGame with list of player : ");
        socketList.forEach(function (socket) {
            console.log(socket.user);
        });
        for (let i = 0; i < socketList.length; i++) {
            const name = socketList[i].user;
            if (i < 7) {
                listPlayerHost.push(name);
            }
            listPlayer.push(name);
        }
        listPlayer.forEach(function (playerName) {
            getSocketByName(playerName).emit("createPlayer", playerName);
        });
        listPlayerHost.forEach(function (playerHostName) {
            getSocketByName(playerHostName).emit("createHost", playerHostName);
        });

        const hostId = listPlayerHost.length - 1;
        initHost(hostId, getSubListPlayer(hostId));

        listPlayer.forEach(function (player) {
            getSocketByName(player).emit("removeStart");
        });
    });

    socket.on("initHostOver", function (name) {
        const hostId = listPlayerHost.indexOf(name) - 1;
        if (hostId >= 0) {
            initHost(hostId, getSubListPlayer(hostId));
        } else {
            console.log("all host have finished their init");
            listPlayerHost.forEach(function (host) {
                getSocketByName(host).emit("initPlayerPosition");
            });
            listPlayer.forEach(function (player) {
                getSocketByName(player).emit("readyToStart");
            });
        }
    });

    socket.on('disconnect', function (e) {
        if (socketList.indexOf(this) > -1) {
            socketList.splice(socketList.indexOf(this), 1);
            let username_disconnected = this.user;
            removePlayerOrPlayerHost(username_disconnected);
            console.log('Client disconnected : ' + username_disconnected + ' ' + e);
            if(socketList.length == 0) {
            	firstPlayer = 0;
            }
        }
    });
});

function isUnique(name) {
    let unique = true;
    socketList.forEach(function (socket) {
        if (socket.user == name) {
            unique = false;
        }
    });
    return unique;
}

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
    let family = getFamily(host + 1);
    let zone = getZone(host + 1);
    const data = {
        "playerList": listPlayer,
        "family": family,
        "zone": zone
    };
    getSocketByName(listPlayerHost[host]).emit("initPlayerHost", JSON.stringify(data));
}

function getFamily(host) {
    switch (host) {
        case 1 :
            return {
                "PHFather": "god",
                "PHSon1": listPlayer[1],
                "PHSon2": listPlayer[2]
            };
            break;
        case 2 :
            return {
                "PHRightB": listPlayer[2],
                "PHSon1": listPlayer[3],
                "PHSon2": listPlayer[4]
            };
            break;
        case 3 :
            return {
                "PHRightB": listPlayer[1],
                "PHSon1": listPlayer[5],
                "PHSon2": listPlayer[6]
            };
            break;
        case 4 :
            return {
                "PHRightB": listPlayer[6]
            };
            break;
        case 5 :
            return {
                "PHRightB": listPlayer[3]
            };
            break;
        case 6 :
            return {
                "PHRightB": listPlayer[4]
            };
            break;
        case 7 :
            return {
                "PHRightB": listPlayer[5]
            };
            break;
    }
}

function getZone(host) {
    switch (host) {
        case 1 :
            return {
                "distanceD": 0,
                "distanceF": 1000,
                "angleD": 0,
                "angleF": 360
            };
            break;
        case 2 :
            return {
                "distanceD": 1000,
                "distanceF": 50000,
                "angleD": 0,
                "angleF": 180
            };
            break;
        case 3 :
            return {
                "distanceD": 1000,
                "distanceF": 50000,
                "angleD": 180,
                "angleF": 360
            };
            break;
        case 4 :
            return {
                "distanceD": 50000,
                "distanceF": 200000,
                "angleD": 0,
                "angleF": 90
            };
            break;
        case 5 :
            return {
                "distanceD": 50000,
                "distanceF": 200000,
                "angleD": 90,
                "angleF": 180
            };
            break;
        case 6 :
            return {
                "distanceD": 50000,
                "distanceF": 200000,
                "angleD": 180,
                "angleF": 270
            };
            break;
        case 7 :
            return {
                "distanceD": 50000,
                "distanceF": 200000,
                "angleD": 270,
                "angleF": 360
            };
            break;
    }
}

function getSocketByName(name) {
    for (let i = 0; i < socketList.length; i++) {
        if (socketList[i].user == name) {
            return socketList[i];
        }
    }
}


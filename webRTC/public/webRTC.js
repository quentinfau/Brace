let offerSent = false;
let answerSent = false;
let user = null;
let user2 = null;
let socket = null;
let pcLocal;
let pcLocalList = {};
let dcList = {};
let dc1 = null;
let dc2 = null;
let activedc;

const cfg = {'iceServers': [{'url': "stun:stun.l.google.com:19302"}]},
    con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

const sdpConstraints = {
    optional: []
};
function connectToWebSocket() {
    socket = io.connect(location.origin);
    socket.on('welcomeMessage', function (data) {
        console.log("received message from the server : " + data.message);
        data.user = user;
        writeMsg(data);
    });
    socket.on('listOfClient', function (list) {
        updateList(list);
    });
    socket.on('negotiationMessage', function (data) {
        console.log("received message from the server : " + data);
        if (data.action == "offer") {
            user2 = data.from;
            processOffer(data.data);
        } else if (data.action == "answer") {
            if (data.to == user) {
                processAnswer(data.data, data.id);
            }
        }
    });
    socket.emit('nouveau_client', user);
}
function connectTo() {
    pcLocal = new RTCPeerConnection(cfg, con);
    pcLocal.onicecandidate = function () {
        if (pcLocal.iceGatheringState == "complete" && !offerSent) {
            offerSent = true;
            sendNegotiation("offer", pcLocal.localDescription);
        }
    };
    dc1 = pcLocal.createDataChannel(createID(user, user2), {reliable: true});
    activedc = dc1;
    dc1.onopen = function () {
        console.log('Connected');
        let data = {user: "system", message: "the datachannel " + dc1.label + " has been opened"};
        writeMsg(data);
        offerSent = false;
    };
    dc1.onmessage = function (e) {
        if (e.data.charCodeAt(0) == 2) {
            return
        }
        let data = JSON.parse(e.data);
        writeMsg(data);
    };
    pcLocal.createOffer(function (desc) {
        pcLocal.setLocalDescription(desc, function () {
        }, function () {
        });
        console.log("------ SEND OFFER ------");

    }, function () {
    }, sdpConstraints);

    pcLocalList[createID(user, user2)] = pcLocal;
    if (dc1 != null) {
        dcList[createID(user, user2)] = dc1;
    }
}
function createID(local, remote) {
    return local + '-' + remote;
}

function processAnswer(answer) {
    let answerDesc = new RTCSessionDescription(answer);
    pcLocalList[createID(user, user2)].setRemoteDescription(answerDesc);
    console.log("------ PROCESSED ANSWER ------");
    return true;
}

function processOffer(offer) {
    let pcRemote = new RTCPeerConnection(cfg, con);
    pcRemote.ondatachannel = function (e) {
        dc2 = e.channel || e;
        activedc = dc2;
        dc2.onopen = function () {
            console.log('Connected');
            //on écrit dans le chat que le user s'est connecté
            let data = {user: "system", message: "the datachannel " + dc2.label + " has been opened"};
            writeMsg(data);
            answerSent = false;
            pcLocalList[createID(user, user2)] = pcLocal;
            if (dc1 != null) {
                dcList[createID(user, user2)] = dc1;
            }
            if (dc2 != null) {
                dcList[createID(user, user2)] = dc2;
            }
        };
        dc2.onmessage = function (e) {
            let data = JSON.parse(e.data);
            writeMsg(data);
        };
    };
    pcRemote.onicecandidate = function () {
        if (pcRemote.iceGatheringState == "complete" && !answerSent) {
            answerSent = true;
            sendNegotiation("answer", pcRemote.localDescription);
        }
    };

    pcLocalList[createID(user, user2)] = pcRemote;
    if (dc2 != null) {
        dcList[createID(user, user2)] = dc2;
    }

    let offerDesc = new RTCSessionDescription(offer);
    let sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': false,
            'OfferToReceiveVideo': false
        }
    };
    pcRemote.setRemoteDescription(offerDesc);
    pcRemote.createAnswer(function (answerDesc) {
            pcRemote.setLocalDescription(answerDesc);
            console.log("------ SEND ANSWER ------");
        },
        function () {
        },
        sdpConstraints)
}

if (navigator.webkitGetUserMedia) {
    RTCPeerConnection = webkitRTCPeerConnection
}

function sendMessage() {
    if (messageTextBox.value) {
        for (let id in dcList) {
            dcList[id].send(JSON.stringify({message: messageTextBox.value, user: user}));
        }
        chatlog.innerHTML += '[' + user + '] ' + messageTextBox.value + '</p>';
        messageTextBox.value = "";
    }
    return false
}

function sendNegotiation(type, sdp) {
    let json = {from: user, to: user2, action: type, data: sdp};
    console.log("Sending [" + user + "] to [" + user2 + "]: " + JSON.stringify(sdp));
    socket.emit("negotiationMessage", JSON.stringify(json));
}

function writeMsg(data) {
    chatlog.innerHTML += '[' + data.user + '] ' + data.message + '</p>';
    chatlog.scrollTop = chatlog.scrollHeight;
}

function updateList(list) {
    let x = document.getElementById("userList");
    x.onchange = function () {
        let selected = x.options[x.selectedIndex].value;
        console.log(selected);
        $("#user2").val(selected);
    };
    while (x.options.length > 0) {
        x.remove(0);
    }
    list.forEach(function (entry) {
        let c = document.createElement("option");
        c.text = entry;
        x.options.add(c);
    });
}

setid.onclick = function () {
    user = $("#user").val();
    connectToWebSocket();
    return false;
};
connectToRemote.onclick = function () {
    user2 = $("#user2").val();
    connectTo();
};
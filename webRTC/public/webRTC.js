let offerSent = false;
let answerSent = false;
let player;
let remote;
let socket = null;
let pcLocal;
let dc1 = null;
let dc2 = null;
let activedc;

const cfg = {'iceServers': [{'url': "stun:stun.l.google.com:19302"}]},
    con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

const sdpConstraints = {
    optional: []
};

function createID(local, remote) {
    return local + '-' + remote;
}

function processAnswer(answer) {
    let answerDesc = new RTCSessionDescription(answer);
    pcLocal.setRemoteDescription(answerDesc);
    console.log("------ PROCESSED ANSWER ------");
    return true;
}

if (navigator.webkitGetUserMedia) {
    RTCPeerConnection = webkitRTCPeerConnection;
}

function sendMessage() {
    sendData(messageTextBox.value, player.dataChannel);
    /*
     if (messageTextBox.value) {
     for (let id in dcList) {
     dcList[id].send(JSON.stringify({message: messageTextBox.value, user: myPlayer}));
     }
     chatlog.innerHTML += '[' + myPlayer + '] ' + messageTextBox.value + '</p>';
     messageTextBox.value = "";
     }*/
    return false
}


function sendData(data, dataChannel) {
    if (data) {
        dataChannel.send(JSON.stringify({message: data, user: player.name}));
        chatlog.innerHTML += '[' + player.name + '] ' + data + '</p>';
        messageTextBox.value = "";
    }

    return false
}

function sendNegotiation(type, sdp, sender, receiver) {
    let json = {from: sender, to: receiver, action: type, data: sdp};
    console.log("Sending [" + sender + "] to [" + receiver + "]: " + JSON.stringify(sdp));
    socket.emit("negotiationMessage", JSON.stringify(json));
}

function writeMsg(data) {
    chatlog.innerHTML += '[' + data.user + '] ' + data.message + '</p>';
    chatlog.scrollTop = chatlog.scrollHeight;
}

/*function updateList(list) {
    let x = document.getElementById("userList");
    x.onchange = function () {
        let selected = x.options[x.selectedIndex].value;
        console.log(selected);
        $("#myHost").val(selected);
    };
    while (x.options.length > 0) {
        x.remove(0);
    }
    list.forEach(function (entry) {
        let c = document.createElement("option");
        c.text = entry;
        x.options.add(c);
    });
}*/
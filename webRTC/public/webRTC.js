let offerSent = false;
let answerSent = false;
let player;
let host;
let remote;
let socket = null;
let pcLocal;
let dc1 = null;
let dc2 = null;

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
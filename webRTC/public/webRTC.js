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

function finalizeConnection(answer) {
    let answerDesc = new RTCSessionDescription(answer);
    pcLocal.setRemoteDescription(answerDesc);
    console.log("------ PROCESSED ANSWER ------");
    return true;
}

function sendMessage() {
    sendData(messageTextBox.value, player.dataChannel);
    return false
}


function sendData(data, dataChannel) {
    if (data) {
        if (dataChannel!=null){
            dataChannel.send(JSON.stringify({message: data, user: player.getName()}));
        }
        else {
            console.error("bug");
        }
        chatlog.innerHTML += '[' + player.getName() + '] ' + data + '</p>';
        messageTextBox.value = "";
    }
    return false
}

function sendNegotiation(type, sdp, sender, receiver) {
    let json = {from: sender, to: receiver, action: type, data: sdp};
    console.log("Sending [" + sender + "] to [" + receiver + "]: " + JSON.stringify(sdp));
    socket.emit("negotiationMessage", JSON.stringify(json));
}

function sendNegotiationSwitchHost(type, sdp, sender, receiver, dataChannel) {
    let json = {from: sender, to: receiver, type: type, data: sdp};
    console.log("Sending [" + sender + "] to [" + receiver + "]: " + JSON.stringify(sdp));
    sendData(json,dataChannel);
   // socket.emit("negotiationMessage", JSON.stringify(json));
}

function writeMsg(data) {
    chatlog.innerHTML += '[' + data.user + '] ' + data.message + '</p>';
    chatlog.scrollTop = chatlog.scrollHeight;
}

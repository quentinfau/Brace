let connections = {};

function PlayerHost(name) {
    this.name = name;
    this.JSLeft = null;
    this.JSRight = null;
    this.JSForward = null;
    this.timestamp = Date().getTime();
    console.log('Nouvel objet Player créé : ' + this.name );
}

function addConnection(connection){
    this.connections[connection.id] = connection;
}

function removeConnection(connection){
    this.connections.splice(this.connections.indexOf(connection.id), 1);
}

function setJSLeft(JSLeft){
    this.JSLeft = JSLeft;
}

function setJSRight(JSRight){
    this.JSRight = JSRight;
}

function setJSForward(JSForward){
    this.JSForward = JSForward;
}

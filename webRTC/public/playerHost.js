let connections = {};

function PlayerHost(name) {
    this.name = name;
    console.log('Nouvel objet Player créé : ' + this.name );
}

function addConnection(connection){
    this.connections[connection.id] = connection;
}

function removeConnection(connection){
    this.connections.splice(this.connections.indexOf(connection.id), 1);
}
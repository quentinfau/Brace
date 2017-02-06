function Connection(id, sendChannel, receiveChannel) {
    this.id = id;
    this.sendChannel = sendChannel;
    this.receiveChannel = receiveChannel;
    console.log('Nouvel objet Connection créé : send = ' + this.sendChannel.label  + " receive = " + this.receiveChannel.label);
}
function Connection(){

}
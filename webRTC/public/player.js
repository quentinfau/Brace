
function Player(name) {
    this.name = name;
    this.connection = null;
    this.radius = 0;
    this.angle = 0;
    this.speed = 0;
    this.coordonneX = 0;
    this.coordonneY = 0;
    console.log('Nouvel objet Player créé : ' + this.name );
    
    function setCoordonneX(coordonneX){
    	this.coordonneX = coordonneX;
    }

    function setCoordonneY(coordonneY){
    	this.coordonneY = coordonneY;
    }

    function setRadius(radius){
        this.radius = radius;
    }

    function setSpeed(speed){
        this.speed = speed;
    }

    function setAngle(angle){
        this.angle = angle;
    }

    function setConnection(connection){
        this.connection = connection;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Player;
} else {
    window.Player = Player;
}

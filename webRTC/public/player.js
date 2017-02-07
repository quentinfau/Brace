let neighborhood = [] ;

let neighbor = {
	name,
	coordonneX,
	coordonneY,
	radius,
	angle,
	speed
}

function Player(name) {
    this.name = name;
    this.dataChannel = null;
    this.radius = 0;
    this.angle = 0;
    this.speed = 0;
    this.coordonneX = 0;
    this.coordonneY = 0;
    this.rank = 1 ;
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
       
    function setRank(rank1){
    	this.rank = rank1;
    }

    function setDataChannel(dataChannel){
        this.dataChannel = dataChannel;
    }
    
    function getCoordonneX(){
    	return this.CoordonneX;
    }
    
    function getCoordonneY(){
    	return this.CoordonneY;
    }
    
    function getAngle(){
    	return this.angle;
    }
    
    function getRadius(){
    	return this.radius;
    }

    function getSpeed(){
    	return this.speed;
    }
    
    function getRank(){
    	return this.rank;
    }

    
    function addNeighbor(name1,coordonneX1,coordonneY1,radius1,angle1,speed1) {
    	var neighbor1;
    	neighbor1.name = name1;
    	neighbor1.coordonneX1 = coordonneX1;
    	neighbor1.coordonneY1 = coordonneY1;
    	neighbor1.radius1 = radius1;
    	neighbor1.angle1 = angle1;
    	neighbor1.speed1 = speed1;
    	
    	neighborhood.push(neighbor1); 	
    }
    
    function removeNeighbor(name) {
        this.neighborhood.splice(this.neighborhood.indexOf(name), 1);
    }
 
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Player;
} else {
    window.Player = Player;
}



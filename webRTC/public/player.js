

let Player = function (){

	

	/*this.neighbor = {
		namen : "f",
		coordonneX : "d",
		coordonneY : "p",
		radius : "e",
		angle : "z",
		speed : "m"
	};
	this.neighborhood = [this.neighbor] ;*/
	this.name = "bob";
	this.dataChannel = null;
	this.radius = 0;
	this.angle = 0;
	this.speed = 0;
	this.coordonneX = 0;
	this.coordonneY = 0;
	this.rank = 1 ;
		
    //console.log('Nouvel objet Player créé : ' + name );
    
	this.getCoordonneX = function (coordonneX){
    	coordonneX = coordonneX;
    };

    this.getCoordonneY = function (coordonneY){
    	coordonneY = coordonneY;
    };

    this.setRadius = function (radius){
        radius = radius;
    };

    this.setSpeed = function (speed){
        speed = speed;
    };

    this.setAngle = function(angle){
        angle = angle;
    };
       
    this.setRank = function (rank1){
    	rank = rank1;
    }; 

    this.setDataChannel = function (dataChannel){
        dataChannel = dataChannel;
    };
    
    this.getCoordonneX = function(){
    	return CoordonneX;
    };
    
    this.getCoordonneY = function(){
    	return CoordonneY;
    };
    
    this.getAngle = function(){
    	return angle;
    };
    
    this.getRadius = function(){
    	return radius;
    };

    this.getSpeed = function(){
    	return speed;
    };
    
    this.getRank = function(){
    	return rank;
    };

    /*
    this.addNeighbor = function(name1,coordonneX1,coordonneY1,radius1,angle1,speed1) {
    	var neighbor1;
    	neighbor1.namen = name1;
    	neighbor1.coordonneX = coordonneX1;
    	neighbor1.coordonneY = coordonneY1;
    	neighbor1.radius = radius1;
    	neighbor1.angle = angle1;
    	neighbor1.speed = speed1;
    	
    	neighborhood.push(neighbor1); 	
    };
    
    this.removeNeighbor = function(name){
        neighborhood.splice(neighborhood.indexOf(name), 1);
    };*/
 
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Player;
} else {
    window.Player = Player;
}



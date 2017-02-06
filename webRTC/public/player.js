
function Player(name) {
    this.name = name;
    this.connection = connection;
    this.rayon = 0;
    this.angle = 0;
    this.vitesse = 0
    this.coordonneX = 0;
    this.coordonneY = 0;
    console.log('Nouvel objet Player créé : ' + this.name );
}

function setCoordonneX(coordonneX){
	this.coordonneX = coordonneX;
}

function setCoordonneY(coordonneY){
	this.coordonneY = coordonneY;
}

function setRayon(rayon){
    this.rayon = rayon;
}

function setVitesse(rayon){
    this.vitesse = vitesse;
}

function setAngle(angle){
    this.angle = angle;
}

function setConnection(connection){
    this.connection = connection;
}


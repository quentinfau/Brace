/*------------------------------------------------------------------------*/
/*                        Declaration des objets                          */
/*------------------------------------------------------------------------*/
let Zone = function(nameZone,god) {
	
	/*-------------------- Attributes --------------------*/
	this.name=nameZone;
	this.god=god;
	this.players=[]; // Liste triee
	this.father=null;
	this.sonL=null;
	this.sonR=null;
	
	/*-------------------- Methods --------------------*/
	this.setFather = function (father){
		this.father=father;
	};
	this.getFather = function(){
		return this.father;
	};
	this.setSonL = function (xsonL){
		this.sonL=xsonL;
	};
	this.getSonL = function(){
		return this.sonL;
	};
	this.setSonR = function (xsonR){
		this.sonR=xsonR;
	};
	this.getSonR = function(){
		return this.sonR;
	};
	this.isGod = function(){
		return this.god;
	};
	
	this.displayFamily = function (){
		var display=this.name + "=";
		if(this.father != null){display+= "father:" + this.father.name + ":";}
		if(this.sonL != null){display+= "sonL:" + this.sonL.name + ":";}
		if(this.sonR != null){display+= "sonR:" + this.sonR.name + ":";}
		display+= this.god;
		console.log(display);
    };
    
    /**
     * Affichage de liste (liste des joueurs si param null
     */
    this.displayList = function (list){
    	if (list==null) {
        	console.log(this.name + ":LIST_OF_PLAYERS_" + this.getPlayersCount());
        	for (let s of this.players)
        	{
        		console.log(s.id + ":" + s.pos);
        	}
    	} else {
    		console.log(this.name + ":LIST_");
        	for (let s of list)
        	{
        		console.log(s.player.id + ":" + s.player.pos + ":" + s.zone.name + ":" + s.count);
        	}
    	}
    };
    
    /**
     * Récupération du premier joueur
     */
    this.getFirstPlayer = function(){
    	let min = 999999;
    	let first = null;
    	for (let p of this.players)
    	{
    		if(p.pos < min) {
    			min = p.pos;
    			first = p;
    		}
    	}
    	
    	return first;
    };

    /**
     * Récupération du dernier joueur
     */
    this.getLastPlayer = function(){
    	let max = -99999;
    	let last = null;
    	for (let p of this.players)
    	{
    		if(p.pos > max) {
    			max = p.pos;
    			last = p;
    		}
    	}
    	
    	return last;
    };

    /**
     * Récupération du nombre de joueurs
     */
    this.getPlayersCount = function(){
    	return this.players.length;
    };
    
    /**
     * Récupération des premiers et derniers joueurs pour chaque zone (récursif, à modifier pour la prise en compte de WEB-RTC)
     */
    this.getDataToSend = function(){
    	let data = [];
    	if(this.god) {
    		// Je suis la zone 1, je calcule le classement final
    		let dataL = this.sonL.getDataToSend();
    		let dataR = this.sonR.getDataToSend();
    		data = dataL.concat(dataR);
    		data.sort(this.comparePlayers);
    		d("dataSentBy:" + this.name);
        	this.displayList(data);
        	this.sendClassementToChildren(data);
    	} else if(this.sonL == null && this.sonG == null) {
    		// Je suis une zone sans fils, j'envoie simplement les bonnes infos
    		if(this.getFirstPlayer()!= null)
    			data.push(new Classement(this.getFirstPlayer(),this,this.getPlayersCount()));
    		if(this.getLastPlayer()!= null)
    			data.push(new Classement(this.getLastPlayer(),this,this.getPlayersCount()));
    	} else {
    		// Je suis une zone quelconque, je merge mes infos et ceux de mes fils avant de les envoyer
    		let dataL = this.sonL.getDataToSend();
    		let dataR = this.sonR.getDataToSend();
    		let dataLR = [];
    		dataLR = dataL.concat(dataR);
    		dataLR.sort(this.comparePlayers);
    		
    		let dataF = [];
    		if(this.getFirstPlayer()!= null)
    			dataF.push(new Classement(this.getFirstPlayer(),this,this.getPlayersCount()));
    		if(this.getLastPlayer()!= null)
    			dataF.push(new Classement(this.getLastPlayer(),this,this.getPlayersCount()));
    		
    		data = dataLR.concat(dataF);
    		data.sort(this.comparePlayers);
    	}
    	
    	// Suppression des doublons pour les cas où le premier et le dernier joueur sont le même joueur (un joueur dans la zone)
    	var cache = {};
    	data = data.filter(function(elem,index,array){
    		return cache[elem.player.id]?0:cache[elem.player.id]=1;
    	});
    	
    	return data;
    };
    
    this.comparePlayers = function(a,b) {
    	return a.player.pos-b.player.pos;
    };
    
    /**
     * Descente des informations classement aux fils (recursif, à modifier pour prendre en compte web-RTC
     */
    this.sendClassementToChildren = function(data) {
    	let top=null;
    	let topClass;
    	let bottom=null;
    	let bottomClass;
    	
    	for (var i=0; i <= data.length-1; i++)
    	{
    		if(top==null && data[i].zone.name==this.name) {
    			top = data[i].player.pos;
    			topClass = i+1;
    		}
    		if(top!=null && data[i].zone.name==this.name) {
    			bottom = data[i].player.pos;
    			bottomClass = i+1;
    		}
    	}
    	
    	if(!god) {
    		this.generateClassementPlayer(topClass, bottomClass, data.length);
    	}
    	
    	if(!(this.sonL == null && this.sonG == null)) {
    		this.sonL.sendClassementToChildren(data);
    		this.sonR.sendClassementToChildren(data);
    	}
    };
    
    this.generateClassementPlayer = function(topId, bottomId, size){
    	d("AFFICHAGE DU CLASSEMENT FINAL ____ " + this.name);
    	console.log("top:"+topId+"_bot:"+bottomId+"_size:"+size);
    	let ax = 1;
    	let ay;
    	if(topId==1) {
    		ay=1;
    	} else {
        	ay = topId*100/size | 0;
    	}
    	let bx=this.getPlayersCount();
    	let by = bottomId*100/size | 0;
    	let position;
    	//console.log("ax:" + ax + "_ay:" + ay + "_bx:" + bx + "_by:" + by);
    	let fctA = (by-ay)/(bx-ax) | 0;
    	let fctB = by-fctA*bx | 0;
    	this.players.sort(function(a, b){return a.pos-b.pos});
    	for(var i=0; i <= this.players.length-1; i++) {
    		position = (i+1)*fctA + fctB | 0; // FONCTION AFFINE
    		//console.log("DEBUG_POS " + p.pos + " : " + fctA + " _ " + fctB);
    		console.log("Joueur_" + this.players[i].id + " is " + position + "%");
    	}
    };
    
    this.displayDataToSend = function(){
    	let display = this.name + "=from:" + this.getFirstPlayer().id + "_to:" + this.getLastPlayer().id + "_count:" + this.getPlayersCount();
    	console.log(display);
    };
};

let Player = function(namePlayer,zone,position) {
	this.id = namePlayer;
	this.pos = position;
	this.zone = zone;
	
	this.zone.players.push(this);
	
	this.display = function (){
		var display=this.id + "=";
		//console.log("----------");
		display+= "zone:" + this.zone + ":";
		display+= "pos:" + this.pos + ":";
		console.log(display);
		//sconsole.log("----------");
    };
};

let Classement = function(p,z,c) {
	this.player=p;
	this.zone=z;
	this.count=c;
};

let d = function(o) {
	let l="----------------------";
	console.log(l + o + l);
};

/*------------------------------------------------------------------------*/
/*                       Instanciation des objets                         */
/*------------------------------------------------------------------------*/
d("Création des zones");
let z1 = new Zone("Zone1", true);
let z2 = new Zone("Zone2", false);
let z3 = new Zone("Zone3", false);
var z4 = new Zone("Zone4", false);
var z5 = new Zone("Zone5", false);
var z6 = new Zone("Zone6", false);
var z7 = new Zone("Zone7", false);

d("Association des zones");
z1.setSonL(z2);
z2.setFather(z1);
z1.setSonR(z3);
z3.setFather(z1);

z2.setSonL(z4);
z4.setFather(z2);
z2.setSonR(z5);
z5.setFather(z2);

z3.setSonL(z6);
z6.setFather(z3);
z3.setSonR(z7);
z7.setFather(z3);

d("Affichage des familles de zones");
/*z1.displayFamily();
z2.displayFamily();
z3.displayFamily();
z4.displayFamily();
z5.displayFamily();
z6.displayFamily();
z7.displayFamily();*/

d("Création des joueurs");
let p1 = new Player("A", z2, 7);
let p2 = new Player("B", z2, 7);
let p3 = new Player("C", z2, 5);
let p4 = new Player("D", z2, 9);
let p5 = new Player("E", z2, 8);
let p6 = new Player("F", z2, 2);

//let p7 = new Player("G", z3, 3);

let p8 = new Player("H", z4, 22);
let p9 = new Player("I", z4, 22);
let p10 = new Player("J", z4, 14);

let p11 = new Player("K", z5, 27);
let p12 = new Player("L", z5, 11);
let p13 = new Player("M", z5, 24);
let p14 = new Player("N", z5, 19);

let p15 = new Player("O", z6, 29);
let p16 = new Player("P", z6, 12);
let p17 = new Player("Q", z6, 17);
let p18 = new Player("R", z6, 11);
let p19 = new Player("S", z6, 23);
let p20 = new Player("T", z6, 29);
let p21 = new Player("U", z6, 14);

let p22 = new Player("V", z7, 14);
let p23 = new Player("W", z7, 15);
let p24 = new Player("X", z7, 28);
let p25 = new Player("Y", z7, 29);
let p26 = new Player("Z", z7, 13);

d("Affichage des joueurs par zone");
z1.displayList();
z2.displayList();
z3.displayList();
z4.displayList();
z5.displayList();
z6.displayList();
z7.displayList();

d("Affichage des données à envoyer pour le classement par zone");
z2.displayDataToSend();
//z3.displayDataToSend();
z4.displayDataToSend();
z5.displayDataToSend();
z6.displayDataToSend();
z7.displayDataToSend();

d("Affichage finale ZONE 1");
z1.getDataToSend();

/*------------------------------------------------------------------------*/
/*                             END OF FILE                                */
/*------------------------------------------------------------------------*/
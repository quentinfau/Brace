var balloon, speed, cursors, map, cap, apple, mapCenter, obstacles,malusGroup, switchGroup, rayon, angleDegree, updateDelay, neighborsSprites = [],textClassement;
// VARs for smartphone control
var btnDeviceSpeedUp,btnDeviceSpeedDown,btnDeviceDirLeft,btnDeviceDirRight,deviceControlUp=false,deviceControlDown=false,deviceControlLeft=false,deviceControlRight=false;
const WORLD_WIDTH = 400000
    , WORLD_HEIGHT = 400000;
const ROTATE_SPEED = 200;
const MAX_PLAYER_SPEED = 1000
    , MIN_PLAYER_SPEED = 1;
const INITIAL_SPEED = 634/4
    , SPEED_MULTIPLICATOR = 35;
const ROPE_SPEED = 10;
const  WORLD_SCALE = 0.50;
const DIAMETER = 16000;
const CENTER_WORLD_X = WORLD_WIDTH / 2;
const CENTER_WORLD_Y = WORLD_HEIGHT / 2;
const RAYON = DIAMETER / 2;

const NB_OBSTACLES = 5000;
const NB_MALUS = 0;
const NB_SWITCH_MALUS = 0;
const DEBUG = true;

const UPDATE_DELAY = 20;
var exist = false;
var tileSprite;
var switchLR = false;
var skin ;

var Game = {
    preload: function () {

    	skin = $( "#skin option:selected" ).text();;;

    	game.load.spritesheet('Bleu', './assets/images/balloon_animated_small.png', 100, 50);
    	game.load.spritesheet('Rouge', './assets/images/balloon_animated_small_Rouge.png', 100, 50);
    	game.load.spritesheet('Rose', './assets/images/balloon_animated_small_Rose.png', 100, 50);
    	game.load.spritesheet('Vert', './assets/images/balloon_animated_small_Vert.png', 100, 50);
    	game.load.spritesheet('Jaune', './assets/images/balloon_animated_small_Jaune.png', 100, 50);
    	game.load.spritesheet('Blanc', './assets/images/balloon_animated_small_Blanc.png', 100, 50);
    	game.load.spritesheet('Violet', './assets/images/balloon_animated_small_Violet.png', 100, 50);
    	game.load.spritesheet('Orange', './assets/images/balloon_animated_small_Orange.png', 100, 50);
    	game.load.spritesheet('Coeur', './assets/images/balloon_animated_small_Love.png', 100, 50);
    	game.load.spritesheet('Crane', './assets/images/balloon_animated_small_Skull.png', 100, 50);


        game.load.image('background', './assets/images/background3.png');
        game.load.image('cap', 'assets/images/arrowCap_small.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('sida', './assets/images/sida.png');
		game.load.image('malus', './assets/images/malus.png');
		game.load.image('switch', './assets/images/switchLR.png');
        game.load.image('deviceSpeed', './assets/images/btn_device_speed.png');
        game.load.image('deviceDirection', './assets/images/btn_device_direction.png');
        
        neighborsSprites = [];
        
        game.scale.maxWidth = 800;
        game.scale.maxHeight = 600;
        game.scale.width = 800;
        game.scale.height = 600;
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically = true;
        this.scale.updateLayout(true);
        
        //player.skin = skin;

        updateDelay = 0;
        speed = 1; // La vitesse du joueur
        mapCenter = new Phaser.Point(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC
        map = new Phaser.Circle(CENTER_WORLD_X, CENTER_WORLD_Y, DIAMETER);
        tileSprite = game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
        graphics = game.add.graphics(0, 0);
        graphics.lineStyle(20, 0x00ff00, 30);
        graphics.drawCircle(map.x, map.y, map.diameter);
        graphics.lineStyle(20, 0xFF3300, 1);
        graphics.drawCircle(map.x, map.y, 100000);
        graphics.drawCircle(map.x, map.y, 2000);
        graphics.lineStyle(20, 0xFFFF33, 1);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x, mapCenter.y + DIAMETER / 2);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x, mapCenter.y - DIAMETER / 2);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x + DIAMETER / 2, mapCenter.y);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x - DIAMETER / 2, mapCenter.y);
        cap = game.add.sprite(35, 40, 'cap');
        cap.anchor.setTo(0.5, 0.5);
        cap.fixedToCamera = true;
        cap.cameraOffset.setTo(35, 40);
        
        var style = { font: "bold 64px Arial", fill: "#81319d", boundsAlignH: "center", boundsAlignV: "middle" };
        textClassement = game.add.text(110, 0, "XX%", style);
        textClassement.fixedToCamera = true;
        textClassement.cameraOffset.setTo(90, 10);
        textClassement.setShadow(3, 3, 'rgba(228,185,240,0.7)', 2);
        
        this.generateBalloon();
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);
        apple = game.add.sprite(CENTER_WORLD_X, CENTER_WORLD_Y, 'apple');
        this.generateObstacles();
        this.generateMalus();
        this.generateSwitchMalus();
        game.physics.enable([balloon, apple, mapCenter, neighborsSprites], Phaser.Physics.ARCADE);
        if (!game.device.desktop) {
        	
        	btnDeviceSpeedUp = game.add.button(game.camera.x,game.camera.y,'deviceSpeed', null,this);
        	btnDeviceSpeedUp.width = game.camera.width;
        	btnDeviceSpeedUp.height = game.camera.height/4;
			btnDeviceSpeedUp.fixedToCamera = true;
			btnDeviceSpeedUp.alpha=0.5;
			btnDeviceSpeedUp.events.onInputOver.add(function(){deviceControlUp=true;});
			btnDeviceSpeedUp.events.onInputOut.add(function(){deviceControlUp=false;});
			btnDeviceSpeedUp.events.onInputDown.add(function(){deviceControlUp=true;});
			btnDeviceSpeedUp.events.onInputUp.add(function(){deviceControlUp=false;});
			
			btnDeviceSpeedDown = game.add.button(game.camera.x,game.camera.height-game.camera.height/4,'deviceSpeed', null,this);
			btnDeviceSpeedDown.width=game.camera.width;
			btnDeviceSpeedDown.height=game.camera.height/4;
			btnDeviceSpeedDown.fixedToCamera = true;
			btnDeviceSpeedDown.alpha=0.5;
			btnDeviceSpeedDown.events.onInputOver.add(function(){deviceControlDown=true;});
			btnDeviceSpeedDown.events.onInputOut.add(function(){deviceControlDown=false;});
			btnDeviceSpeedDown.events.onInputDown.add(function(){deviceControlDown=true;});
			btnDeviceSpeedDown.events.onInputUp.add(function(){deviceControlDown=false;});
			
			btnDeviceDirLeft = game.add.button(game.camera.x,game.camera.height/4,'deviceDirection', null,this);
			btnDeviceDirLeft.width=game.camera.width/2;
			btnDeviceDirLeft.height=game.camera.height/2;
			btnDeviceDirLeft.fixedToCamera = true;
			btnDeviceDirLeft.alpha=0.7;
			btnDeviceDirLeft.events.onInputOver.add(function(){deviceControlLeft=true;});
			btnDeviceDirLeft.events.onInputOut.add(function(){deviceControlLeft=false;});
			btnDeviceDirLeft.events.onInputDown.add(function(){deviceControlLeft=true;});
			btnDeviceDirLeft.events.onInputUp.add(function(){deviceControlLeft=false;});
			
			btnDeviceDirRight = game.add.button(game.camera.width/2,game.camera.height/4,'deviceDirection', null,this);
			btnDeviceDirRight.width=game.camera.width/2;
			btnDeviceDirRight.height=game.camera.height/2;
			btnDeviceDirRight.fixedToCamera = true;
			btnDeviceDirRight.alpha=0.7;
			btnDeviceDirRight.events.onInputOver.add(function(){deviceControlRight=true;});
			btnDeviceDirRight.events.onInputOut.add(function(){deviceControlRight=false;});
			btnDeviceDirRight.events.onInputDown.add(function(){deviceControlRight=true;});
			btnDeviceDirRight.events.onInputUp.add(function(){deviceControlRight=false;});
			
        }
    },
    
    update: function () {
    	//obstacles.forEach(this.improveObstaclesDisplaying);
        //this.mockNeighborhood();
        balloon.body.velocity.x = 0;
        balloon.body.velocity.y = 0;
        balloon.body.angularVelocity = 0;
        this.obstacleCollision();
        this.switchMalusCollision();
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || deviceControlRight) {
            this.moveChecker();
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || deviceControlLeft) {
            this.moveChecker();
        }
        else if ((game.input.keyboard.isDown(Phaser.Keyboard.UP) || deviceControlUp) && speed <= MAX_PLAYER_SPEED) {
            speed++;
            balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }
        else if ((game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || deviceControlDown) && speed > MIN_PLAYER_SPEED) {
            speed--;
            balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }
        this.malusCollision();
        game.physics.arcade.velocityFromAngle(balloon.angle, INITIAL_SPEED + SPEED_MULTIPLICATOR * speed, balloon.body.velocity);
        this.wallCollision();
        cap.rotation = game.physics.arcade.angleBetween(cap, mapCenter);
        this.appleCollision(balloon, apple);
        this.obstacleCollision();
        this.neighborCollision();
        rayon = Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2));
        
        //this.updatePlayer();
        neighborsSprites.forEach(function (p) {
            this.Game.updateNeighborSprite(p);
        });
        updateDelay++;
        game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);
        
        balloon.scale.set(WORLD_SCALE);
        apple.scale.set(WORLD_SCALE);
        tileSprite.tileScale.set(WORLD_SCALE);
        
        //textClassement.setText(player.rank+ "%");

	    /*if(player.winner != null) {
        	if(player.winner == "winner") {
        		game.state.start('Game_Done');
	        } else {
	        	game.state.start('Game_Over');
	        }
	    }*/
    },
    
    render: function () {
        if (DEBUG == true) {
            //game.debug.spriteInfo(balloon, 32, 32);
        	game.debug.geom(btnDeviceSpeedUp,'#404AA4');
        	//game.debug.geom(btnDeviceSpeedDown,'#7240A4');
        	//game.debug.geom(btnDeviceDirLeft,'#A4408D');
        	//game.debug.geom(btnDeviceDirRight,'#40A475');
        }
    },
    
    improveObstaclesDisplaying: function(o){
    	var minx=game.camera.x-100;
    	var maxx=minx + game.camera.width+100;
    	var miny=game.camera.y-100;
    	var maxy= miny + game.camera.height+100;
    	//console.log(minx + ":" + maxx + ":" + miny + ":" + maxy);
    	
    	if(o.alive) {
    		if(o.x < minx || o.x > maxx || o.y < miny || o.y > maxy) {
    			o.kill();
        		//console.log("killed");
    		}
    	} else {
    		if(o.x >= minx && o.x <= maxx && o.y >= miny && o.y <= maxy){
    			//console.log("reset at (" + o.x + ";" + o.y + ")");
    			o.reset(o.x,o.y);
    		}
    	}
   
    	if(o.x < minx
    			|| o.x > maxx
    			|| o.y < miny
    			|| o.y > maxy) {
    		o.kill();
    		console.log("killed");
    	} else {
    		o.reset(o.x,o.y);
    		console.log("reset");
    	}
    },
    
    moveChecker: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || deviceControlLeft) {
            if(switchLR) {
				balloon.body.angularVelocity = ROTATE_SPEED;
			} else {
				balloon.body.angularVelocity = -ROTATE_SPEED;
			}
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || deviceControlRight) {
            if(switchLR) {
            	balloon.body.angularVelocity = -ROTATE_SPEED;
            } else {
            	balloon.body.angularVelocity = ROTATE_SPEED;
            }
        }
    }
    , wallCollision: function () {
        if (Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2)) >= RAYON) {
            neighborsSprites.forEach(function (p) {
                p.destroy();
            });
            game.state.start('Game_Over');
        }
    }
    , updatePlayer: function () {
        player.coordonneX = balloon.x;
        player.coordonneY = balloon.y;

        var angleB = game.physics.arcade.angleBetween(mapCenter, balloon) * (180 / Math.PI);
        if (angleB < 0) {
            player.angle = 360 + angleB;
        }
        else {
            player.angle = angleB;
        }
        //Direction
        if (balloon.angle < 0) {
            player.direction = 360 + balloon.angle;
        }
        else {
            player.direction = balloon.angle;
        }
        player.radius = rayon;
        player.speed = speed;
        player.sendPosition();
    },

    generateMalus : function(){
        malusGroup = game.add.group();
        malusGroup.enableBody = true;
        for (var i = 0; i < NB_MALUS; i++) {
            var malus = malusGroup.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'malus');
            malus.body.immovable = true;
            game.physics.enable([malus], Phaser.Physics.ARCADE);
            malus.body.setCircle(200 / 2, (-200 / 2 + 0.5 * malus.width / malus.scale.x), (-200 / 2 + 0.5 * malus.height / malus.scale.y));
            malus.scale.set(WORLD_SCALE);
        }
    },

    malusCollision : function(){
         game.physics.arcade.overlap(balloon, malusGroup, function () {
              if(this.getRandomInt(1,2)%2 == 0){
              speed=speed/2;}else{
                  speed = speed*2;
              }
              balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }, null, this);
    },

    generateSwitchMalus : function(){
        switchGroup = game.add.group();
        switchGroup.enableBody = true;
        for (var i = 0; i < NB_SWITCH_MALUS; i++) {
            var switchLR = switchGroup.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'switch');
            switchLR.body.immovable = true;
            game.physics.enable([switchLR], Phaser.Physics.ARCADE);
            switchLR.body.setCircle(200 / 2, (-200 / 2 + 0.5 * switchLR.width / switchLR.scale.x), (-200 / 2 + 0.5 * switchLR.height / switchLR.scale.y));
            switchLR.scale.set(WORLD_SCALE);
        }
    },

    switchMalusCollision : function(){
       game.physics.arcade.overlap(balloon, switchGroup, function () {
                switchLR = !switchLR;
        }, null, this);
    },

    generateBalloon: function () {

    	balloon = game.add.sprite(this.getRandomInt(CENTER_WORLD_X-RAYON, CENTER_WORLD_X+RAYON),this.getRandomInt(CENTER_WORLD_Y-RAYON,CENTER_WORLD_Y+RAYON), 'Crane');

        balloon.anchor.setTo(0.5, 0.5);
        game.physics.enable(balloon, Phaser.Physics.ARCADE);
        balloon.body.setCircle(50 / 2, 25, 0);
        balloon.body.collideWorldBounds = true;
        balloon.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        balloon.animations.play('move');
        balloon.rotation = game.physics.arcade.angleBetween(balloon, mapCenter);
//        var style = { font: "30px Arial", fill: "#000000" };
//        var nameSprite = this.game.add.text(0, 0, player.name, style);
//        nameSprite.rotation=0;
//        balloon.addChild(nameSprite);
    }
    , getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    , appleCollision: function (balloon, apple) {
        game.physics.arcade.collide(balloon, apple, null, function () {
            neighborsSprites.forEach(function (p) {
                p.destroy();
            });
            game.state.start('Game_Done');
        }, null, this);
    }
    , getPlayerX: function () {
        return this.game.balloon;
    }
    , getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    , generateObstacles: function () {
        obstacles = game.add.group();
        obstacles.enableBody = true;
        for (var i = 0; i < NB_OBSTACLES; i++) {
            var obstacle = obstacles.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'sida');
            obstacle.body.immovable = true;
            game.physics.enable([obstacle], Phaser.Physics.ARCADE);
            obstacle.scale.set(WORLD_SCALE);
            obstacle.body.setCircle(obstacle.width / 2, (-obstacle.width / 2 + 0.5 * obstacle.width / obstacle.scale.x), (-obstacle.height / 2 + 0.5 * obstacle.height / obstacle.scale.y));
        }
    }
    , obstacleCollision: function () {
        game.physics.arcade.collide(balloon, obstacles, null, function () {
            game.physics.arcade.collide(balloon, obstacles);
            game.camera.shake(0.002, 50);
        }, null, this);
    }
    , mockNeighborhood: function () {

        player.neighborhood.forEach(function (p) {
                this.Game.isNeighbor(p);
                if (p.name != player.name) {
                    if (this.exist) {
                        //console.log("UPDATE");
                        this.Game.updateNeighbors(p);
                    }
                    else {
                        this.Game.createNeighbor(p);
                    }

                }
            }
        );
    }
    , createNeighbor: function (p) {
        var b = game.add.sprite(p.x, p.y, skin);
        b.rotation = p.angle;
        b.anchor.setTo(0.5, 0.5);
        game.physics.enable(b, Phaser.Physics.ARCADE);
        b.body.setCircle(50 / 2, 25, 0);
        b.body.collideWorldBounds = true;
        b.animations.add('moveM', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        b.animations.play('moveM');
        b.speed = p.speed;
        b.name = p.name;
        b.angle = p.direction;
        b.rotation = p.angle;
        b.scale.set(WORLD_SCALE);
        b.oldX = p.x;
        b.oldY = p.y;
//        var style = { font: "30px Arial", fill: "#000000" };
//        var nameSprite = this.game.add.text(0, 0, p.name, style);
//        nameSprite.rotation=0;
//        b.addChild(nameSprite);

        neighborsSprites.push(b);
        // this.updateNeighbors(p);
    }
    , neighborCollision: function () {
        game.physics.arcade.collide(balloon, neighborsSprites, null, function () {
            game.physics.arcade.collide(balloon, neighborsSprites);
            game.camera.shake(0.02, 100);
        }, null, this);
    }
    , updateNeighbors: function (p) {
        neighborsSprites.forEach(function (s) {
            if (s.name == p.name && p.x != s.oldX && p.y != s.oldY) {
                s.x = p.x;
                s.y = p.y;
                s.oldX = p.x;
                s.oldY = p.y;
                s.speed = p.speed;
                s.rotation = p.angle;
                s.angle = p.direction;
            }
        });
    }, updateNeighborSprite: function (s) {
        s.body.velocity.x = 0;
        s.body.velocity.y = 0;
        s.body.angularVelocity = 0;
        var speedSprite = INITIAL_SPEED + SPEED_MULTIPLICATOR * s.speed;
        game.physics.arcade.velocityFromAngle(s.angle, speedSprite, s.body.velocity);

    }
    , isNeighbor: function (p) {
        this.exist = false;
        neighborsSprites.forEach(function (pe) {
            if (pe.name == p.name) {
                this.exist = true;
            }
        });
    }
};

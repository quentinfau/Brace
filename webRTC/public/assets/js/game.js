var balloon, speed, cursors, map, cap, apple, mapCenter,obstacles;

const WORLD_WIDTH = 400300, WORLD_HEIGHT = 400300;
const ROTATE_SPEED=200;
const MAX_PLAYER_SPEED=10,MIN_PLAYER_SPEED=1;
const INITIAL_SPEED=634, SPEED_MULTIPLICATOR=35;
const ROPE_SPEED=10;
const DIAMETER=16000;

const CENTER_WORLD_X = WORLD_WIDTH/2;
const CENTER_WORLD_Y = WORLD_HEIGHT/2;
const RAYON = DIAMETER/2;
const NB_OBSTACLES = 1000;

var Game = {

    preload : function () {
        game.load.spritesheet('balloon', './assets/images/balloon_animated_small.png', 100, 50);
        game.load.image('background', './assets/images/background.png');
        game.load.image('cap', 'assets/images/arrowCap_small.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('sida', './assets/images/sida.png');

        playerBK = new Player("F");
        console.log("init "+ playerBK.name);

    },

    create : function () {
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	//this.scale.pageAlignHorizontally = true;
    	this.scale.pageAlignVertically = true;
    	this.scale.setScreenSize( true );

        speed = 1;           			// La vitesse du joueur
        mapCenter = new Phaser.Point(WORLD_WIDTH/2, WORLD_HEIGHT/2);
        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC

        map = new Phaser.Circle(CENTER_WORLD_X, CENTER_WORLD_Y, DIAMETER);
        game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');



        var graphics = game.add.graphics(0, 0);
        graphics.lineStyle(20, 0x00ff00, 1);
        graphics.drawCircle(map.x, map.y, map.diameter);

        cap = game.add.sprite(35, 40, 'cap');
        cap.anchor.setTo(0.5, 0.5);
        cap.fixedToCamera = true;
        cap.cameraOffset.setTo(35, 40);

        this.generatePlayer();
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.camera.follow(balloon);
        apple = game.add.sprite(CENTER_WORLD_X,CENTER_WORLD_Y, 'apple');

        this.generateObstacles();
        game.physics.enable([balloon,apple], Phaser.Physics.ARCADE);

    },



    update: function() {
    	//smartphone control : https://github.com/flogvit/phaser-swipe

    	balloon.body.velocity.x = 0;
    	balloon.body.velocity.y = 0;
    	balloon.body.angularVelocity = 0;

	    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	    	this.moveChecker();
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	    	this.moveChecker();
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && speed <= MAX_PLAYER_SPEED)
	    {
	        speed++;
	        balloon.animations.currentAnim.speed=ROPE_SPEED*speed;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && speed > MIN_PLAYER_SPEED)
	    {
	        speed--;
	        balloon.animations.currentAnim.speed=ROPE_SPEED*speed;
	    }
       // console.log("name : "+playerBK.name);
        playerBK.sendPosition();
        console.log("SENT");
	    game.physics.arcade.velocityFromAngle(balloon.angle, INITIAL_SPEED+SPEED_MULTIPLICATOR*speed, balloon.body.velocity);
	    this.wallCollision();
	    cap.rotation = game.physics.arcade.angleBetween(cap, mapCenter);

        this.appleCollision(balloon,apple);
        this.obstacleCollision();
    },
    moveChecker : function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            balloon.body.angularVelocity = -ROTATE_SPEED;
        }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            balloon.body.angularVelocity = ROTATE_SPEED;
        }

    },
     wallCollision:function(){

    	    if (Math.sqrt(Math.pow(WORLD_WIDTH/2-balloon.body.x,2)+Math.pow(WORLD_HEIGHT/2-balloon.body.y,2)) >= RAYON) {
    	    	game.state.start('Game_Over');
    	    }
    },
 generatePlayer:function(){
        var min_x,max_x,min_y,max_y;
        max_x = CENTER_WORLD_X+RAYON-1000;
        min_x = CENTER_WORLD_X-RAYON;
        min_y = CENTER_WORLD_Y-RAYON;
        max_y = CENTER_WORLD_Y+RAYON - 1000;
//        console.log(CENTER_WORLD_X);
//        console.log(CENTER_WORLD_Y);
//        console.log(min_x);

        balloon = game.add.sprite(this.getRandomInt(min_x, max_x),this.getRandomInt(min_y,max_y), 'balloon');
        balloon.anchor.setTo(0.5, 0.5);
        game.physics.enable(balloon, Phaser.Physics.ARCADE);
        balloon.body.collideWorldBounds = true;
        balloon.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        balloon.animations.play('move');
        console.log("max x : "+max_x+"balloon  x :"+balloon.x+" y : "+balloon.y);
    },

    getRandomInt:function(min, max) {
        return Math.floor(Math.random() * (max-min+1)) + min;
    },
     appleCollision:function(balloon,apple){
         game.physics.arcade.collide(balloon, apple,null, function(){
            // Next time the snake moves, a new block will be added to its length.
             //apple.destroy();
            game.state.start('Game_Done');
        },null,this);
    },
    getPlayerX:function() {
    	return this.game.ballon;
    },
     getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
},

 generateObstacles: function(){
            obstacles = game.add.group();
      obstacles.enableBody = true;
    for(var i=0;i<NB_OBSTACLES;i++){
          var obstacle = obstacles.create(this.getRandomInt(CENTER_WORLD_X-RAYON,CENTER_WORLD_X+RAYON), this.getRandomInt(CENTER_WORLD_Y-RAYON,CENTER_WORLD_Y+RAYON), 'sida');

    }
},

 obstacleCollision: function(){
     game.physics.arcade.collide(balloon, obstacles,null, function(){
        // Next time the snake moves, a new block will be added to its length.
         //apple.destroy();
        game.state.start('Game_Over');
    },null,this);
},

};







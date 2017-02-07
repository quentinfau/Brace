var player, speed, cursors, map,apple;

const WORLD_WIDTH = 400300, WORLD_HEIGHT = 400300;
const ROTATE_SPEED=200;
const MAX_PLAYER_SPEED=10,MIN_PLAYER_SPEED=1;
const INITIAL_SPEED=634, SPEED_MULTIPLICATOR=35;
const ROPE_SPEED=10;
const DIAMETER=16000;

const CENTER_WORLD_X = WORLD_WIDTH/2;
const CENTER_WORLD_Y = WORLD_HEIGHT/2;
const RAYON = DIAMETER/2;

var Game = {

    preload : function () {
        game.load.spritesheet('player', './assets/images/balloon_animated.png', 300, 150);
        game.load.image('background', './assets/images/background.png');
        game.load.image('apple', './assets/images/apple.png');

    },

    create : function () {

        speed = 1;           			// La vitesse du joueur

        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC
        
        map = new Phaser.Circle(CENTER_WORLD_X, CENTER_WORLD_Y, DIAMETER);
        game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
        
        apple = game.add.sprite(CENTER_WORLD_X +1500,CENTER_WORLD_Y, 'apple');

        var graphics = game.add.graphics(0, 0);
        graphics.lineStyle(20, 0x00ff00, 1);
        graphics.drawCircle(map.x, map.y, map.diameter);
        
        player = generatePlayer();
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.camera.follow(player);



        game.physics.enable([player,apple], Phaser.Physics.ARCADE);

    },



    update: function() {
    	
    	player.body.velocity.x = 0;
    	player.body.velocity.y = 0;
    	player.body.angularVelocity = 0;

	    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	    	moveChecker();
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	    	moveChecker();
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && speed <= MAX_PLAYER_SPEED)
	    {
	        speed++;
	        player.animations.currentAnim.speed=ROPE_SPEED*speed;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && speed > MIN_PLAYER_SPEED)
	    {
	        speed--;
	        player.animations.currentAnim.speed=ROPE_SPEED*speed;
	    }
	    game.physics.arcade.velocityFromAngle(player.angle, INITIAL_SPEED+SPEED_MULTIPLICATOR*speed, player.body.velocity);
	    console.log(Math.sqrt(Math.pow(WORLD_WIDTH/2-player.body.x,2)+Math.pow(WORLD_HEIGHT/2-player.body.y,2)));
	    wallCollision();
        appleCollision(player,apple);
    }
};

function moveChecker() {
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.body.angularVelocity = -ROTATE_SPEED;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.body.angularVelocity = ROTATE_SPEED;
    }
}

function wallCollision(){

	    if (Math.sqrt(Math.pow(WORLD_WIDTH/2-player.body.x,2)+Math.pow(WORLD_HEIGHT/2-player.body.y,2)) >= RAYON) {
	    	game.state.start('Game_Over');
	    }
}

function appleCollision(player,apple){
     game.physics.arcade.collide(player, apple,null, function(){
        // Next time the snake moves, a new block will be added to its length.
         //apple.destroy();
        game.state.start('Game_Done');
    },null,this);
}

function generatePlayer(){
    var player;
    var min_x,max_x,min_y,max_y;
    max_x = CENTER_WORLD_X+RAYON-1000;
    min_x = CENTER_WORLD_X-RAYON;
    min_y = CENTER_WORLD_Y-RAYON;
    max_y = CENTER_WORLD_Y+RAYON - 1000;
    console.log(CENTER_WORLD_X);
    console.log(CENTER_WORLD_Y);
    console.log(min_x);

    player = game.add.sprite(getRandomInt(min_x, max_x),getRandomInt(min_y,max_y), 'player');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
    player.animations.play('move');
    console.log("max x : "+max_x+"Player  x :"+player.x+" y : "+player.y);
    return player;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
}

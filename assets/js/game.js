var player, speed, cursors, map;

const WORLD_WIDTH = 400300, WORLD_HEIGHT = 400300;
const ROTATE_SPEED=200;
const MAX_PLAYER_SPEED=10,MIN_PLAYER_SPEED=1;
const INITIAL_SPEED=634, SPEED_MULTIPLICATOR=35;
const ROPE_SPEED=10;
const DIAMETER=16000;

var Game = {

    preload : function () {
        game.load.spritesheet('player', './assets/images/balloon_animated.png', 300, 150);
        game.load.image('background', './assets/images/background.png');
    },

    create : function () {
        speed = 1;           			// La vitesse du joueur

        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC
        
        map = new Phaser.Circle(WORLD_WIDTH/2, WORLD_HEIGHT/2, DIAMETER);
        game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
        
        var graphics = game.add.graphics(0, 0);
        graphics.lineStyle(1, 0x00ff00, 1);
        graphics.drawCircle(map.x, map.y, map.diameter);
        
        player = game.add.sprite(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.camera.follow(player);
        player.body.collideWorldBounds = true;
        player.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        player.animations.play('move');
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

	    if (Math.sqrt(Math.pow(WORLD_WIDTH/2-player.body.x,2)+Math.pow(WORLD_HEIGHT/2-player.body.y,2)) >= (DIAMETER/2)) {
	    	game.state.start('Game_Over');
	    }
}

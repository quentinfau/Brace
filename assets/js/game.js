var player, speed, cursors;

const WORLD_WIDTH = 2000, WORLD_HEIGHT = 2000;
const ROTATE_SPEED=200;
const MAX_PLAYER_SPEED=10,MIN_PLAYER_SPEED=1;
const INITIAL_SPEED=100, SPEED_MULTIPLICATOR=35;

var Game = {

    preload : function () {
        //game.load.image('player', './assets/images/balloon.png');
        game.load.spritesheet('player', './assets/images/balloon_animated.png', 300, 150);
        game.load.image('background', './assets/images/background.png');
    },

    create : function () {
        speed = 1;           			// La vitesse du joueur

        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC

        game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
        player = game.add.sprite(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.camera.follow(player);
        player.body.collideWorldBounds = true;
        player.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], 10, true);
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
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && speed > MIN_PLAYER_SPEED)
	    {
	        speed--;
	    }
	    
	    game.physics.arcade.velocityFromAngle(player.angle, INITIAL_SPEED+SPEED_MULTIPLICATOR*speed, player.body.velocity);

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
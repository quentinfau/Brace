var startBtn_menu;

var Menu = {

    preload : function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        game.load.image('menu', './assets/images/menu.png');
    },

    create: function () {
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	this.scale.pageAlignVertically = true;
    	this.scale.setScreenSize( true );
    	
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above)
    	startBtn_menu = this.add.button(0, 0, 'menu', this.startGame,this);
    	startBtn_menu.width = game.camera.width;
    	startBtn_menu.height = game.camera.height;
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};

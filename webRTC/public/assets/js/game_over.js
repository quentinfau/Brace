var restartBtn_gameover;

var Game_Over = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', './assets/images/gameover.png');
    },

    create : function() {
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	this.scale.pageAlignVertically = true;
    	this.scale.setScreenSize( true );
        // Create button to start game like in Menu.
    	restartBtn_gameover = this.add.button(0, 0, 'gameover', this.startGame, this);
    	restartBtn_gameover.width = game.camera.width;
    	restartBtn_gameover.height = game.camera.height;

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');

    }

};

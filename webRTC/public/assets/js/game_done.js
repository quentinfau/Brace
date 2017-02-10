var restartBtn_gamedone;

var Game_Done = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', './assets/images/gamedone.png');
    },

    create : function() {
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	this.scale.pageAlignVertically = true;
    	this.scale.updateLayout( true );

        // Create button to start game like in Menu.
    	restartBtn_gamedone = this.add.button(0, 0, 'gameover', this.startGame, this);
    	restartBtn_gamedone.width = game.camera.width;
    	restartBtn_gamedone.height = game.camera.height;

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');

    }

};

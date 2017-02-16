var no_1 = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('1', './assets/images/1.png');
    },

    create : function() {
    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.pageAlignVertically = true;
    	game.scale.updateLayout( true );

        var img = game.add.image(0, 0, '1');
        img.width=1080;
        img.height=1080;
        game.time.events.add(Phaser.Timer.SECOND, this.startGame, this);

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');

    }

};

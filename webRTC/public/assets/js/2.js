var no_2 = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('2', './assets/images/2.png');
    },

    create : function() {
    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.pageAlignVertically = true;
    	game.scale.updateLayout( true );

       var img = game.add.image(0, 0, '2');
        img.width=1080;
        img.height=1080;
        game.time.events.add(Phaser.Timer.SECOND, this.start1, this);

    },

    start1: function () {

        // Change the state back to Game.
        this.state.start('1');

    }

};

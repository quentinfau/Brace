var no_3 = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('3', './assets/images/3.png');
    },

    create : function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.pageAlignVertically = true;
    	game.scale.updateLayout( true );

        var img = game.add.image(0, 0,'3');
        img.width=1080;
        img.height=1080;

        game.time.events.add(Phaser.Timer.SECOND, this.start2, this);

    },

    start2: function () {

        // Change the state back to Game.
        this.state.start('2');

    }

};

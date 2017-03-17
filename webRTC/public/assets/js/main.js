var game;

game = new Phaser.Game(1080, 1080, Phaser.AUTO, 'brace');

game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.add('Game_Over', Game_Over);

game.state.add('Game_Done', Game_Done);

game.state.start('Game');

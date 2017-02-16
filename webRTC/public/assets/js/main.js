var game;

// Create a new game instance 600px wide and 450px tall:
game = new Phaser.Game(1080, 1080, Phaser.AUTO, 'brace');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

// Adding the Game state.
game.state.add('Game', Game);

game.state.add('3', no_3);
game.state.add('2', no_2);
game.state.add('1', no_1);

game.state.add('Game_Over', Game_Over);

game.state.add('Game_Done', Game_Done);

game.state.start('3');

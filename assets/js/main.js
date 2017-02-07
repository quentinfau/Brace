var game;

// Create a new game instance 600px wide and 450px tall:

game = new Phaser.Game(1080, 1920, Phaser.AUTO, '');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

// Adding the Game state.
game.state.add('Game', Game);

game.state.add('Game_Over', Game_Over);

game.state.start('Menu');

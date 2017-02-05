// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com
var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 10; //number of snake body sections
var snakeSpacer = 2; //parameter that sets the spacing between sections
var lastCell;
            var oldLastCellx;
var Game ={

preload:function() {

    game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');

},



create :function(){
        apple = {};                     // An object for the apple;
        squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 9;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false; 
        snakeSection = [];
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 2000, 2000);

    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(200, 200, 'snake');
    snakeHead.anchor.setTo(0.5, 0.5);
    game.camera.follow(snakeHead);
    
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(100, 200, 'snake');
        snakeSection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(100, 200);
    }
    
    // Genereate the first apple.
        this.generateApple();

game.physics.enable([snakeHead,apple], Phaser.Physics.ARCADE);
        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

},

update:function() {


    // Increase a counter on every update call.
    updateDelay++;
    
    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;

    if (updateDelay % (15 - speed) == 0)
    {
        snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));

        // Everytime the snake head moves, insert the new location at the start of the array, 
        // and knock the last position off the end

        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        snakePath.unshift(part);
console.log("Snake Section "+snakeSection.length);
        for (var i = 1; i <= snakeSection.length-1; i++)
        {
            console.log("Snake Path : "+snakePath[i*snakeSpacer]);
            snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
            snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
        }
          

    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -900;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 900;
    }
       
        
  // in create
  this.swipe = new Swipe(this.game,this.snakeHead);

  // in update
  var direction = this.swipe.check();
  if (direction!==null) {
    // direction= { x: x, y: y, direction: direction }
    switch(direction.direction) {
       case this.swipe.DIRECTION_LEFT:snakeHead.body.angularVelocity = -900;
       case this.swipe.DIRECTION_RIGHT: snakeHead.body.angularVelocity = 900;
       case this.swipe.DIRECTION_UP:
       case this.swipe.DIRECTION_DOWN:
       case this.swipe.DIRECTION_UP_LEFT:
       case this.swipe.DIRECTION_UP_RIGHT:
       case this.swipe.DIRECTION_DOWN_LEFT:
       case this.swipe.DIRECTION_DOWN_RIGHT:
    }
  }
     if(addNew){
         numSnakeSections++;
          for (var i = snakePath.length; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(new Phaser.Point(snakeSection[snakeSection.length-1].x, new Phaser.Point(snakeSection[snakeSection.length-1].y)));
    }
//         snakePath.splice(numSnakeSections,0,new Phaser.Point(snakeSection[snakeSection.length-1].x));
//         snakePath.push(new Phaser.Point(snakeSection[snakeSection.length-1].x));         snakeSection.push(game.add.sprite(snakeSection[snakeSection.length-1].x, snakeSection[snakeSection.length-1].y, 'snake'));
            addNew = false;
        }
     // Check for apple collision.
        this.appleCollision(snakeHead);

        // Check for collision with self. Parameter is the head of the snake.
        this.selfCollision(snakeHead);
        // Check with collision with wall. Parameter is the head of the snake.
        this.wallCollision(snakeHead);
    }

},
    selfCollision: function(head) {

    // Check if the head of the snake overlaps with any part of the snake.
    for(var i = 1; i < snakeSection.length; i++){
        if(head.x == snakeSection[i].x && head.y == snakeSection[i].y){

            // If so, go to game over screen.
            game.state.start('Game_Over');
        }
    }

},
    wallCollision: function(head) {

    // Check if the head of the snake is in the boundaries of the game field.

    if(head.x >= game.world.width || head.x < 0 || head.y >= game.world.heigth || head.y < 0){


        // If it's not in, we've hit a wall. Go to game over screen.
        game.state.start('Game_Over');
    }

},
    
    appleCollision: function(head) {

    // Check if any part of the snake is overlapping the apple.
    // This is needed if the apple spawns inside of the snake.
    game.physics.arcade.collide(head, apple,null, function(){ 
        // Next time the snake moves, a new block will be added to its length.
            addNew = true;

            // Destroy the old apple.
            apple.destroy();

            var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // Add a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
         game.physics.enable([snakeHead,apple], Phaser.Physics.ARCADE);

            // Increase score.
            score++;
            speed++;
        console.log(speed);
            // Refresh scoreboard.
            scoreTextValue.text = score.toString();
        scoreTextValue={};
                            speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },null,this);
    

},
     generateApple: function(){

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // Add a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
         game.physics.enable([snakeHead,apple], Phaser.Physics.ARCADE);
    },

render :function() {

    game.debug.spriteInfo(snakeHead, 32, 32);
    game.debug.spriteInfo(apple, 150, 132);

}

};
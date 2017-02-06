var sprite1;
var sprite2;
var text;

var Game ={
preload : function() {

    game.load.image('atari1', 'assets/images/apple.png');
    game.load.image('atari2', 'assets/images/snake.png');

},



create: function() {
 var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x999999);
        graphics.drawCircle(50, 50, 500);
        graphics.endFill();
        graphics.boundsPadding=0;


     sprite2 = game.add.sprite(0, 0,graphics.generateTexture());
       // sprite2.addChild(graphics);
        sprite2.inputEnabled = true;
       // sprite2.input.enableDrag();

    sprite1 = game.add.sprite(100, 200, 'atari1');
    sprite1.inputEnabled = true;
    sprite1.input.enableDrag();
 game.physics.startSystem(Phaser.Physics.ARCADE);

//    disk = game.add.sprite(80, 0, 'disk');
//    ball1 = game.add.sprite(100, 240, 'wizball');
//    ball2 = game.add.sprite(700, 240, 'wizball');
    // game.physics.arcade.enable([ball1, ball2]);
    game.physics.arcade.enable([sprite1,sprite2]);

    //  By default the Body is a rectangle. Let's turn it into a Circle with a radius of 45 pixels

    sprite1.body.setCircle(45);
    sprite2.body.setCircle(45);

    // ball1.body.immovable = true;
    // ball2.body.mass = 3;

    //  Set the ball to collide with the world, have gravity, bounce, and move.
    sprite1.body.collideWorldBounds = true;
    sprite2.body.collideWorldBounds = true;

    sprite1.body.bounce.set(1);
    sprite2.body.bounce.set(1);

    sprite1.body.gravity.y = 100;
    sprite2.body.gravity.y = 100;

    // ball1.body.velocity.x = 50;
    // ball2.body.velocity.x = -50;

    sprite1.body.velocity.set(150);
    sprite2.body.velocity.set(-200, 60);
    disk.body.velocity.set(50);






    text = game.add.text(16, 16, 'Drag the sprites. Overlapping: false', { fill: '#ffffff' });

},

 update : function() {

    if (checkOverlap(sprite1, sprite2))
    {
        text.text = 'Drag the sprites. Overlapping: true';
    }
    else
    {
        text.text = 'Drag the sprites. Overlapping: false';
    }

}

}

 function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
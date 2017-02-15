var balloon, speed, cursors, map, cap, apple, mapCenter, obstacles,malusGroup, switchGroup, rayon, angleDegree, updateDelay, neighborsSprites = [];
const WORLD_WIDTH = 400000
    , WORLD_HEIGHT = 400000;
const ROTATE_SPEED = 200;
const MAX_PLAYER_SPEED = 1000
    , MIN_PLAYER_SPEED = 1;
const INITIAL_SPEED = 634
    , SPEED_MULTIPLICATOR = 35;
const ROPE_SPEED = 10;
const  WORLD_SCALE = 0.50;
const DIAMETER = 16000;
const CENTER_WORLD_X = WORLD_WIDTH / 2;
const CENTER_WORLD_Y = WORLD_HEIGHT / 2;
const RAYON = DIAMETER / 2;
const NB_OBSTACLES = 0;
const NB_MALUS = 100;
const NB_SWITCH_MALUS = 200;
const DEBUG = true;
const UPDATE_DELAY = 20;
var exist = false;
var tileSprite;
var switchLR = false;
var Game = {
    preload: function () {
        game.load.spritesheet('balloon', './assets/images/balloon_animated_small.png', 100, 50);
        game.load.image('background', './assets/images/background3.png');
        game.load.image('cap', 'assets/images/arrowCap_small.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('sida', './assets/images/sida.png');
                game.load.image('malus', './assets/images/malus.png');
                        game.load.image('switch', './assets/images/switchLR.png');


        neighborsSprites = [];


         game.scale.maxWidth = 800;
        game.scale.maxHeight = 600;
        game.scale.width = 800;
        game.scale.height = 600;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    , create: function () {

        if (!game.device.desktop) {
            swipe = new Swipe(this.game);
        }
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.updateLayout(true);
        updateDelay = 0;
        speed = 1; // La vitesse du joueur
        mapCenter = new Phaser.Point(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC
        map = new Phaser.Circle(CENTER_WORLD_X, CENTER_WORLD_Y, DIAMETER);
        tileSprite = game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
        graphics = game.add.graphics(0, 0);
        graphics.lineStyle(20, 0x00ff00, 30);
        graphics.drawCircle(map.x, map.y, map.diameter);
        graphics.lineStyle(20, 0xFF3300, 1);
        graphics.drawCircle(map.x, map.y, 6000);
        graphics.drawCircle(map.x, map.y, 2000);
        graphics.lineStyle(20, 0xFFFF33, 1);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x, mapCenter.y + DIAMETER / 2);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x, mapCenter.y - DIAMETER / 2);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x + DIAMETER / 2, mapCenter.y);
        graphics.moveTo(mapCenter.x, mapCenter.y);
        graphics.lineTo(mapCenter.x - DIAMETER / 2, mapCenter.y);
        cap = game.add.sprite(35, 40, 'cap');
        cap.anchor.setTo(0.5, 0.5);
        cap.fixedToCamera = true;
        cap.cameraOffset.setTo(35, 40);
        this.generateBalloon();
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
//        game.camera.width = 1000;
//        game.camera.height = 1000;
        game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);
        apple = game.add.sprite(CENTER_WORLD_X, CENTER_WORLD_Y, 'apple');
        this.generateObstacles();
        this.generateMalus();
        this.generateSwitchMalus();
        game.physics.enable([balloon, apple, mapCenter, neighborsSprites], Phaser.Physics.ARCADE);
        //  console.log("Angle : " + game.physics.arcade.angleBetween(mapCenter, balloon));
    }
    , update: function () {
        //smartphone control : https://github.com/flogvit/phaser-swipe
        this.mockNeighborhood();
        balloon.body.velocity.x = 0;
        balloon.body.velocity.y = 0;
        balloon.body.angularVelocity = 0;
        this.obstacleCollision();
        if (!game.device.desktop) {
            this.checkSmartphoneControl();
        }
        this.switchMalusCollision();
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.moveChecker();
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.moveChecker();

        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && speed <= MAX_PLAYER_SPEED) {
            speed++;
            balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && speed > MIN_PLAYER_SPEED) {
            speed--;
            balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }
        this.malusCollision();
        game.physics.arcade.velocityFromAngle(balloon.angle, INITIAL_SPEED + SPEED_MULTIPLICATOR * speed, balloon.body.velocity);
        this.wallCollision();
        cap.rotation = game.physics.arcade.angleBetween(cap, mapCenter);
        this.appleCollision(balloon, apple);
        this.obstacleCollision();
        this.neighborCollision();
        rayon = Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2));
        //Calcul de rayon entre balloon et l'ovule
        // console.log("Rayon : " + rayon);
        if (balloon.angle < 0) {
            //    console.log(360 + balloon.angle);
        }
        else {
            //    console.log(balloon.angle);
        }
        this.updatePlayer();
        neighborsSprites.forEach(function (p) {
            this.Game.updateNeighborSprite(p);
        });
        updateDelay++;
        game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);


    // set our world scale as needed
    balloon.scale.set(WORLD_SCALE);
    apple.scale.set(WORLD_SCALE);
    tileSprite.tileScale.set(WORLD_SCALE);

	    if(player.winner != null) {
        	if(player.winner == "winner") {
        		game.state.start('Game_Done');
	        } else {
	        	game.state.start('Game_Over');
	        }
	    }
    }
    , render: function () {
        if (DEBUG == true) {
            game.debug.spriteInfo(balloon, 32, 32);
        }
    }
    , moveChecker: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            if(switchLR){            balloon.body.angularVelocity = ROTATE_SPEED;
}else {balloon.body.angularVelocity = -ROTATE_SPEED;}
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            if(switchLR){            balloon.body.angularVelocity = -ROTATE_SPEED;
}else {balloon.body.angularVelocity = ROTATE_SPEED;}
        }
    }
    , wallCollision: function () {
        if (Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2)) >= RAYON) {
            neighborsSprites.forEach(function (p) {
                p.destroy();
            });
            game.state.start('Game_Over');
        }
    }
    , updatePlayer: function () {
        player.coordonneX = balloon.x;
        player.coordonneY = balloon.y;
        // console.log("Angle :"+balloon.angle);
        //Calcul de l'angle de balloon par rapport au vagin

        var angleB = game.physics.arcade.angleBetween(mapCenter, balloon) * (180 / Math.PI);
        if (angleB < 0) {
            player.angle = 360 + angleB;
        }
        else {
            player.angle = angleB;
        }
        //Direction
        if (balloon.angle < 0) {
            player.direction = 360 + balloon.angle;
        }
        else {
            player.direction = balloon.angle;
        }
        player.radius = rayon;
        player.speed = speed;
        player.sendPosition();
        //  console.log("SENT");
    },generateMalus : function(){
        malusGroup = game.add.group();
        malusGroup.enableBody = true;
        for (var i = 0; i < NB_MALUS; i++) {
            var malus = malusGroup.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'malus');
            malus.body.immovable = true;
            game.physics.enable([malus], Phaser.Physics.ARCADE);
            malus.body.setCircle(200 / 2, (-200 / 2 + 0.5 * malus.width / malus.scale.x), (-200 / 2 + 0.5 * malus.height / malus.scale.y));
            malus.scale.set(WORLD_SCALE);
        }
    },malusCollision : function(){
         game.physics.arcade.overlap(balloon, malusGroup, function () {
             speed=speed/2;
              balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
        }, null, this);
    },generateSwitchMalus : function(){
        switchGroup = game.add.group();
        switchGroup.enableBody = true;
        for (var i = 0; i < NB_SWITCH_MALUS; i++) {
            var switchLR = switchGroup.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'switch');
            switchLR.body.immovable = true;
            game.physics.enable([switchLR], Phaser.Physics.ARCADE);
            switchLR.body.setCircle(200 / 2, (-200 / 2 + 0.5 * switchLR.width / switchLR.scale.x), (-200 / 2 + 0.5 * switchLR.height / switchLR.scale.y));
            switchLR.scale.set(WORLD_SCALE);
        }
    }, switchMalusCollision : function(){
       game.physics.arcade.overlap(balloon, switchGroup, function () {
                switchLR = !switchLR;
        }, null, this);
    }
    , generateBalloon: function () {
        var min_x, max_x, min_y, max_y;
        max_x = CENTER_WORLD_X + RAYON - 1000;
        min_x = CENTER_WORLD_X - RAYON;
        min_y = CENTER_WORLD_Y - RAYON;
        max_y = CENTER_WORLD_Y + RAYON - 1000;
        balloon = game.add.sprite(player.coordonneX + 200000, player.coordonneY + 200000, 'balloon');
        balloon.anchor.setTo(0.5, 0.5);
        game.physics.enable(balloon, Phaser.Physics.ARCADE);
        balloon.body.setCircle(50 / 2, 25, 0);
        balloon.body.collideWorldBounds = true;
        balloon.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        balloon.animations.play('move');
        //            console.log("balloon  x :"+balloon.x+" y : "+balloon.y);
        balloon.rotation = game.physics.arcade.angleBetween(balloon, mapCenter);
    }
    , getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    , appleCollision: function (balloon, apple) {
        game.physics.arcade.collide(balloon, apple, null, function () {
            // Next time the snake moves, a new block will be added to its length.
            //apple.destroy();
            neighborsSprites.forEach(function (p) {
                p.destroy();
            });
            game.state.start('Game_Done');
        }, null, this);
    }
    , getPlayerX: function () {
        return this.game.balloon;
    }
    , getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    , generateObstacles: function () {
        obstacles = game.add.group();
        obstacles.enableBody = true;
        for (var i = 0; i < NB_OBSTACLES; i++) {
            var obstacle = obstacles.create(this.getRandomInt(CENTER_WORLD_X - RAYON, CENTER_WORLD_X + RAYON), this.getRandomInt(CENTER_WORLD_Y - RAYON, CENTER_WORLD_Y + RAYON), 'sida');
            obstacle.body.immovable = true;
            game.physics.enable([obstacle], Phaser.Physics.ARCADE);
            obstacle.body.setCircle(200 / 2, (-200 / 2 + 0.5 * obstacle.width / obstacle.scale.x), (-200 / 2 + 0.5 * obstacle.height / obstacle.scale.y));
            obstacle.scale.set(WORLD_SCALE);
        }
    }
    , obstacleCollision: function () {
        game.physics.arcade.collide(balloon, obstacles, null, function () {
            game.physics.arcade.collide(balloon, obstacles);
            game.camera.shake(0.02, 100);
        }, null, this);
    }
    , mockNeighborhood: function () {

        player.neighborhood.forEach(function (p) {
                this.Game.isNeighbor(p);
                if (p.name != player.name) {
                    if (this.exist) {
                        //console.log("UPDATE");
                        this.Game.updateNeighbors(p);
                    }
                    else {
                        this.Game.createNeighbor(p);
                    }

                }
            }
        );
        // console.log("Neighbors : " + player.neighborhood.length);
    }
    , createNeighbor: function (p) {
        var b = game.add.sprite(p.x, p.y, 'balloon');
        b.rotation = p.angle;
        b.anchor.setTo(0.5, 0.5);
        game.physics.enable(b, Phaser.Physics.ARCADE);
        b.body.setCircle(50 / 2, 25, 0);
        b.body.collideWorldBounds = true;
        b.animations.add('moveM', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
        b.animations.play('moveM');
        b.speed = p.speed;
        b.name = p.name;
        b.angle = p.direction;
        b.rotation = p.angle;
        b.oldX = p.x;
        b.oldY = p.y;

        neighborsSprites.push(b);
        // this.updateNeighbors(p);
    }
    , neighborCollision: function () {
        game.physics.arcade.collide(balloon, neighborsSprites, null, function () {
            game.physics.arcade.collide(balloon, neighborsSprites);
            game.camera.shake(0.02, 100);
        }, null, this);
    }
    , updateNeighbors: function (p) {
        neighborsSprites.forEach(function (s) {
            if (s.name == p.name && p.x != s.oldX && p.y != s.oldY) {
                s.x = p.x;
                s.y = p.y;
                s.oldX = p.x;
                s.oldY = p.y;
                s.speed = p.speed;
                s.rotation = p.angle;
                s.angle = p.direction;
            }
        });
    }, updateNeighborSprite: function (s) {
        // console.log(s.name+" BEFORE x="+s.x+" y="+s.y);
        s.body.velocity.x = 0;
        s.body.velocity.y = 0;
        s.body.angularVelocity = 0;
        var speedSprite = INITIAL_SPEED + SPEED_MULTIPLICATOR * s.speed;
        game.physics.arcade.velocityFromAngle(s.angle, speedSprite, s.body.velocity);

    }
    , isNeighbor: function (p) {
        this.exist = false;
        neighborsSprites.forEach(function (pe) {
            if (pe.name == p.name) {
                this.exist = true;
            }
        });
    },

    checkSmartphoneControl: function () {
        var direction = this.swipe.check();
        if (direction !== null) {
            switch (direction.direction) {
                case this.swipe.DIRECTION_LEFT:
                    balloon.body.angularVelocity = -ROTATE_SPEED;
                    break;
                case this.swipe.DIRECTION_RIGHT:
                    balloon.body.angularVelocity = ROTATE_SPEED;
                    break;
                case this.swipe.DIRECTION_UP:
                    speed++;
                    balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
                    break;
                case this.swipe.DIRECTION_DOWN:
                    speed--;
                    balloon.animations.currentAnim.speed = ROPE_SPEED * speed;
                    break;
                case this.swipe.DIRECTION_UP_LEFT:
                    balloon.body.angularVelocity = -ROTATE_SPEED;
                    break;
                case this.swipe.DIRECTION_UP_RIGHT:
                    balloon.body.angularVelocity = ROTATE_SPEED;
                    break;
                case this.swipe.DIRECTION_DOWN_LEFT:
                    balloon.body.angularVelocity = -ROTATE_SPEED;
                    break;
                case this.swipe.DIRECTION_DOWN_RIGHT:
                    balloon.body.angularVelocity = ROTATE_SPEED;
                    break;
            }
        }
    }
};

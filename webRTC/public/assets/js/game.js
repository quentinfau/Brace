var balloon, speed, cursors, map, cap, apple, mapCenter, obstacles, rayon, angleDegree, updateDelay, neighbors = []
    , neighborsSprites = [];
const WORLD_WIDTH = 40000
    , WORLD_HEIGHT = 40000;
const ROTATE_SPEED = 200;
const MAX_PLAYER_SPEED = 1000
    , MIN_PLAYER_SPEED = 0;
const INITIAL_SPEED = 634
    , SPEED_MULTIPLICATOR = 35;
const ROPE_SPEED = 10;
const DIAMETER = 2000;
const CENTER_WORLD_X = WORLD_WIDTH / 2;
const CENTER_WORLD_Y = WORLD_HEIGHT / 2;
const RAYON = DIAMETER / 2;
const NB_OBSTACLES = 0;
const DEBUG = true;
const UPDATE_DELAY = 20;
var Game = {
        preload: function () {
            game.load.spritesheet('balloon', './assets/images/balloon_animated_small.png', 100, 50);
            game.load.image('background', './assets/images/background3.png');
            game.load.image('cap', 'assets/images/arrowCap_small.png');
            game.load.image('apple', './assets/images/apple.png');
            game.load.image('sida', './assets/images/sida.png');
            //playerBK = new Player("F");
        }
        , create: function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.updateLayout(true);
            updateDelay = 0;
            speed = 1; // La vitesse du joueur
            mapCenter = new Phaser.Point(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
            cursors = game.input.keyboard.createCursorKeys(); // Setup des contrôles PC
            map = new Phaser.Circle(CENTER_WORLD_X, CENTER_WORLD_Y, DIAMETER);
            game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
            graphics = game.add.graphics(0, 0);
            graphics.lineStyle(20, 0x00ff00, 1);
            graphics.drawCircle(map.x, map.y, map.diameter);
            cap = game.add.sprite(35, 40, 'cap');
            cap.anchor.setTo(0.5, 0.5);
            cap.fixedToCamera = true;
            cap.cameraOffset.setTo(35, 40);
            this.mockNeighborhood();
            this.generateBalloon();
            game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);
            apple = game.add.sprite(CENTER_WORLD_X, CENTER_WORLD_Y, 'apple');
            this.generateObstacles();
            game.physics.enable([balloon, apple, mapCenter, neighborsSprites], Phaser.Physics.ARCADE);
            console.log("Angle : " + game.physics.arcade.angleBetween(mapCenter, balloon));

        }
        , update: function () {
            //smartphone control : https://github.com/flogvit/phaser-swipe
            this.mockNeighborhood();
            balloon.body.velocity.x = 0;
            balloon.body.velocity.y = 0;
            balloon.body.angularVelocity = 0;
            this.obstacleCollision();
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
            game.physics.arcade.velocityFromAngle(balloon.angle, INITIAL_SPEED + SPEED_MULTIPLICATOR * speed, balloon.body.velocity);
            this.wallCollision();
            cap.rotation = game.physics.arcade.angleBetween(cap, mapCenter);
            this.appleCollision(balloon, apple);
            this.obstacleCollision();
            this.neighborCollision();
            rayon = Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2));
            // console.log("Angle :"+balloon.angle);
            //Calcul de l'angle de balloon par rapport au vagin
            var rad = game.physics.arcade.angleBetween(mapCenter, balloon);
            var angleDegree = rad * (180 / Math.PI);
            if (angleDegree < 0) {
                angleDegree = 360 + angleDegree;
            }
          //  console.log("Angle Degree: " + angleDegree);
            //Calcul de rayon entre balloon et l'ovule
           // console.log("Rayon : " + rayon);
            if (balloon.angle < 0) {
                console.log(360 + balloon.angle);
            }
            else {
                console.log(balloon.angle);
            }
            if (updateDelay % UPDATE_DELAY == 0) {
                this.updatePlayer();
            }
            updateDelay++;
            game.camera.follow(balloon, Phaser.Camera.FOLLOW_LOCKON);

        }
        , render: function () {
            if (DEBUG == true) {
                game.debug.spriteInfo(balloon, 32, 32);
            }
        }
        , moveChecker: function () {
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                balloon.body.angularVelocity = -ROTATE_SPEED;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                balloon.body.angularVelocity = ROTATE_SPEED;
            }
        }
        , wallCollision: function () {
            if (Math.sqrt(Math.pow(WORLD_WIDTH / 2 - balloon.body.x, 2) + Math.pow(WORLD_HEIGHT / 2 - balloon.body.y, 2)) >= RAYON) {
                game.state.start('Game_Over');
            }
        }
        , updatePlayer: function () {
            player.coordonneX = balloon.x;
            player.coordonneY = balloon.y;
            if (balloon.angle < 0) {
                player.angle = 360 + balloon.angle;
            }
            else {
                player.angle = balloon.angle;
            }
            player.radius = rayon;
            player.speed = speed;
            player.sendPosition();
            console.log("SENT");
        }
        , generateBalloon: function () {
            var min_x, max_x, min_y, max_y;
            max_x = CENTER_WORLD_X + RAYON - 1000;
            min_x = CENTER_WORLD_X - RAYON;
            min_y = CENTER_WORLD_Y - RAYON;
            max_y = CENTER_WORLD_Y + RAYON - 1000;
            balloon = game.add.sprite(this.getRandomInt(min_x, max_x), this.getRandomInt(min_y, max_y), 'balloon');
            balloon.anchor.setTo(0.5, 0.5);
            game.physics.enable(balloon, Phaser.Physics.ARCADE);
            balloon.body.setCircle(50 / 2, 25, 0);
            balloon.body.collideWorldBounds = true;
            balloon.animations.add('move', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
            balloon.animations.play('move');
            //console.log("max x : "+max_x+"balloon  x :"+balloon.x+" y : "+balloon.y);
        }
        , getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        , appleCollision: function (balloon, apple) {
            game.physics.arcade.collide(balloon, apple, null, function () {
                // Next time the snake moves, a new block will be added to its length.
                //apple.destroy();
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
            }
        }
        , obstacleCollision: function () {
            game.physics.arcade.collide(balloon, obstacles, null, function () {
                game.physics.arcade.collide(balloon, obstacles);
                game.camera.shake(0.02, 100);
            }, null, this);
        }
        , mockNeighborhood: function () {
            var min_x, max_x, min_y, max_y;
            max_x = CENTER_WORLD_X + RAYON - 1000;
            min_x = CENTER_WORLD_X - RAYON;
            min_y = CENTER_WORLD_Y - RAYON;
            max_y = CENTER_WORLD_Y + RAYON - 1000;
            neighbors = [];
            //neighborsSprites = [];
            /* for(var i=0;i<200;i++){
                 var playerN = new Player(i);
                 playerN.coordonneX = this.getRandomInt(min_x,max_x);
                 playerN.coordonneY = this.getRandomInt(min_y,max_y);
                 playerN.speed = this.getRandomInt(0,30);
                 playerN.angle = this.getRandomInt(0,360);
                 console.log(playerN.speed);
                 neighbors.push(playerN);
             }*/
           // console.log("SIZE NEIGHBORS : " + player.neighborhood.length);
            player.neighborhood.forEach(function (p) {
                    var exist = this.Game.isNeighbor(p);
                    if (exist || p.name == player.name) {
                        this.Game.updateNeighbors(p);
                    }
                    else {
                        var b = game.add.sprite(p.x, p.y, 'apple');
                        b.angle = p.angle;
                        b.anchor.setTo(0.5, 0.5);
                        game.physics.enable(b, Phaser.Physics.ARCADE);
                        b.body.setCircle(50 / 2, 25, 0);
                        b.body.collideWorldBounds = true;
                        b.animations.add('moveM', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ROPE_SPEED, true);
                        b.animations.play('moveM');
                        b.speed = p.speed;
                        b.name = p.name;
                        console.log("VOISIN X = " + b.x);
                        console.log("VOISIN Y = " + b.y);
                        neighborsSprites.push(b);
                    }
            });
    }
    , neighborCollision: function () {
        game.physics.arcade.collide(balloon, neighborsSprites, null, function () {
            game.physics.arcade.collide(balloon, neighborsSprites);
            game.camera.shake(0.02, 100);
        }, null, this);
    }
    , updateNeighbors: function (p) {
        var pSprite;
       neighborsSprites.forEach(function(s){
           if(s.name==p.name){
               pSprite = s;


            pSprite.x = p.x;
            pSprite.y = p.y;
            pSprite.angle = p.angle;
            pSprite.speed = p.speed;
            pSprite.body.velocity.x = 0;
            pSprite.body.velocity.y = 0;
            var random = this.getRandomInt(0, 588);
            pSprite.body.angularVelocity = 0;

            game.physics.arcade.velocityFromAngle(pSprite.angle, INITIAL_SPEED + SPEED_MULTIPLICATOR * pSprite.speed, pSprite.body.velocity);
           }
           });
    } ,isNeighbor: function(p) {
        var exist = false;
      //  console.log(neighborsSprites);
      //  console.log(player.neighborhood);
        neighborsSprites.forEach(function (pe) {
            if (pe.name == p.name) {
                console.log("EXIST");
                this.Game.exist = true;
            }
        });
        return exist;
    }
};

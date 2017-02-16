// lets create our first state

var mainState = {
  // object with functions needed for state
  preload: function() {
    game.load.image('coin', 'assets/coin.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('bg', 'assets/background.png');
    game.load.image('jumpBtn', 'assets/jumpButton.png');
    game.load.image('leftBtn', 'assets/leftButton.png');
    game.load.image('muteBtn', 'assets/muteButton.png');
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('player', 'assets/player.png');
    game.load.image('player2', 'assets/player2.png');
    game.load.image('progressBar', 'assets/progressBar.png');
    game.load.image('rightBtn', 'assets/rightButton.png');
    game.load.image('tileset', 'assets/tileset.png');
    game.load.image('wallH', 'assets/wallHorizontal.png');
    game.load.image('wallV', 'assets/wallVertical.png');
    
    // load audio
    game.load.audio('coinsfx', 'assets/coin.mp3');
    game.load.audio('coinsfx', 'assets/coin.ogg');
    game.load.audio('deadsfx', 'assets/dead.mp3');
    game.load.audio('deadsfx', 'assets/dead.ogg');
    game.load.audio('jumpsfx', 'assets/jump.mp3');
    game.load.audio('jumpsfx', 'assets/jump.ogg');
  },
  
  // function if called after preload function
  // game, display, sprites etc
  create: function() {
    game.stage.backgroundColor = '#3498dB';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.cursor = game.input.keyboard.createCursorKeys();
    
    this.player = game.add.sprite(340, game.world.centerY, 'player');
    
    game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = false;
    
    this.coin = game.add.sprite(80, 120, 'coin');
    game.physics.arcade.enable(this.coin);
    
    this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });
    this.score = 0;

    // set properties for platforms group
    this.platforms = game.add.group();

    this.platforms.enableBody = true;
    
    // create parts in platforms group
    this.ledge = this.platforms.create(280, 320, 'wallH');
    this.ledge = this.platforms.create(20, 320, 'wallH');
    this.ledge = this.platforms.create(150, 120, 'wallH');
    this.legde = this.platforms.create(280, 0, 'wallH');
    this.legde = this.platforms.create(20, 0, 'wallH');
    this.legde = this.platforms.create(80, 220, 'wallH');
    this.legde = this.platforms.create(220, 220, 'wallH');
    this.legde = this.platforms.create(480, 0, 'wallV');
    this.legde = this.platforms.create(0, 0, 'wallV');
    
    this.platforms.setAll('body.immovable', true);
    
    //add enemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    game.physics.arcade.enable(this.enemies);
    
    this.enemies.createMultiple(10, 'enemy');
    
    this.time.events.loop(3500, this.addEnemy, this);
    
    // add sfx
    jumpsfx = game.add.audio('jumpsfx');
    coinsfx = game.add.audio('coinsfx');
    deathsfx = game.add.audio('deadsfx');

  },
  
  update: function() {
    // is valled 60 times per second
    // contains logic
    var collidePlatform = this.physics.arcade.collide(this.player, this.platforms);
    var collidePlatform = this.physics.arcade.collide(this.enemies, this.platforms);
    this.movePlayer();
    
    if(!this.player.inWorld) {
      this.playerDie();
      deathsfx.play();
    }
    
    game.physics.arcade.overlap(this.coin, this.player, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
  },
  
  movePlayer: function() {
    if(this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
    } else if(this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
    } else {
      this.player.body.velocity.x = 0;
    }
    if(this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -250;
      jumpsfx.play();
    }
    
  },
  
  updateCoinPosition: function() {
    var coinPosition = [
      { x: 140, y: 60 }, { x: 360, y: 60 },
      { x: 60, y: 140 }, { x: 440, y: 140},
      { x: 130, y: 300 }, { x: 370, y: 300 }
    ];
    
    var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

    for(i = 0; i < coinPosition.length; i++) {
      if(coinPosition[i].x === this.coin.x){
        coinPosition.splice(i, 1);
      }
    }
    
    this.coin.reset(newPosition.x, newPosition.y);
    },
  
  takeCoin: function(coin, player) {
    
    this.coin.kill();
    this.score += 1;
    this.scoreLabel.text = 'Score: ' + this.score;
    coinsfx.play();
    this.updateCoinPosition();
    console.log(this.score);
  },
  

  
  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();
    
    if(!enemy) {
      return;
    }
    
    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = Phaser.Utils.randomChoice(-100, 100);
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },
  
  createWorld: function() {
    
  },
  
  playerDie: function() {
    game.state.start('main');
    deathsfx.play();
  }
};

// initialize app
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gamediv');

// engine add and start main state
game.state.add('main', mainState);
game.state.start('main');
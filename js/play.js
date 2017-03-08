var playState = {
  create: function() {
    
    // global variable to hold lvl number
    game.global.lvlIndex = 0;
    
    // lvl score&lives
    this.lvlScore = 0;
    this.lives = 3;
    
    // inputkeys for cursor/player
    this.cursor = game.input.keyboard.createCursorKeys();

    // create playersprite, bind physics, set anchorpoint and animation
    this.player = game.add.sprite(350, game.world.centerY, 'player2');
    game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.gravity.y = 270;
    this.player.body.bounce.y = 0.2;
    this.player.animations.add('right', [1, 2], 8, true);
    this.player.animations.add('left', [3, 4], 8, true);
    

    
    // function to create world
    this.createWorld();
    
    // create coin sprite, bind physics
    this.coin = game.add.sprite(80, 120, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5, 0.5);

    // add score label and set score variable to 0
    this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });
    this.livesLabel = game.add.text(410, 30, 'Lives: ' + this.lives, { font: '16px Arial', fill: '#ffffff' });
    game.global.score = 0;
    


    
    //add enemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    game.physics.arcade.enable(this.enemies);
    this.enemies.createMultiple(10, 'enemy2');
    
    
    this.nextEnemy = 0;
    
    // load sfx
    jumpsfx = game.add.audio('jumpsfx');
    coinsfx = game.add.audio('coinsfx');
    deathsfx = game.add.audio('deadsfx');
    
    //add emitter with 15 particles and set image to 'pixel', speeds to 150 and gravity 0
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('pixel');
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setXSpeed(-150, 150);
    this.emitter.gravity = 0;
  },
    
  update: function() {
    // is valled 60 times per second
    // contains logic
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    
    // function for player movement
    this.movePlayer();
    
    // kill player if he is/falls outside world
    if(!this.player.inWorld) {
      this.playerDie();
    }
    
    // add enemies using timer
    if(this.nextEnemy < game.time.now) {
      var start = 3000, end = 1000, score = 100;
      var delay = Math.max(start - (start-end)*game.global.score/score, end);
      
      this.addEnemy();
      this.nextEnemy = game.time.now + delay;
    }
    

    
    
    game.physics.arcade.overlap(this.coin, this.player, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    game.physics.arcade.overlap(this.flag, this.player, this.nextLvl, null, this);
  },
  
  movePlayer: function() {
    if(this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if(this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else {
      this.player.body.velocity.x = 0;
    }
    if(this.cursor.up.isDown && this.player.body.onFloor()) {
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
    
    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
    this.coin.kill();
    game.global.score += 1;
    this.lvlScore += 1;
    this.scoreLabel.text = 'Score: ' + game.global.score;
    coinsfx.play();
    this.updateCoinPosition();
    
    // create sprite for levelteleport
    this.lvlPortal();
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
    enemy.animations.add('walk', [0, 1, 2, 3], 5, true);
    enemy.animations.enableUpdate = true;
    enemy.animations.play('walk', 5, true);
  },
  
  createWorld: function() {
    // create the tilemap
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
    this.map.setCollision(2);
  },
  
  playerResurrect: function() {
    this.player.reset(350, game.world.centerY);
  },
  
  playerDie: function() {
    if(!this.player.alive) {
      return;
    }
    deathsfx.play();
    this.player.kill();
    
    if(game.global.score > localStorage.getItem('highscore')) {
      localStorage.setItem('highsore', game.global.score);
    }
    
    //set emitter to player position and start it with 600ms lifetime
    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 15);
    
    if(this.lives >= 1) {
      this.lives = this.lives - 1;
      game.time.events.add(1000, this.playerResurrect, this);

    }
    
    if(this.lives < 1) {
      game.time.events.add(1000, this.startMenu, this);
    }
    this.livesLabel.text = 'Lives: ' + this.lives;
  },
  

  
  lvlPortal: function() {
    if(this.lvlScore > 4) {
      this.flag = game.add.sprite(game.world.centerX, 270, 'finish');
      this.flag.animations.add('wave', [0, 1], 3, true);
      this.flag.animations.enableUpdate = true;
      this.flag.anchor.setTo(0.5, 0.5);
      game.add.tween(this.flag.scale).to({x: 2, y: 2}, 50).to({x: 1, y: 1}, 200).start();
      game.physics.arcade.enable(this.flag);
      this.flag.animations.play('wave', 3, true);
    }
  },
  
  startMenu: function() {
    game.state.start('menu');

  },
  
  nextLvl: function() {
    var lvlNumber = game.global.lvlIndex + 1;
    var next = 'lvl' + lvlNumber;
    game.state.start(next);
  }
};
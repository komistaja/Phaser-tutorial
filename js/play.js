var playState = {
  create: function() {
    
    game.plugins.cameraShake = game.plugins.add(Phaser.Plugin.CameraShake);
    
    // global variable to hold lvl number
    //game.global.lvlIndex = 0;
    
    //add mobileinputs
    if(!game.device.desktop) {
      this.addMobileInputs();
    }
    
    this.lifeUpTimer = game.math.between(6000, 30000);

    
    // lvl score&lives
    if(game.global.devmode) {
      this.lvlScore = 4;
    } else {
      this.lvlScore = 0;
    }
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
    this.coin = game.add.sprite(40, 140, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5, 0.5);

    // add score and lives label and set score variable to 0
    this.scoreLabel = game.add.text(30, 30, 'Score: ' + game.global.score, { font: '16px Arial', fill: '#ffffff' });
    this.livesLabel = game.add.text(410, 30, 'Lives: ' + this.lives, { font: '16px Arial', fill: '#ffffff' });

    


    
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
    // is called 60 times per second
    // contains logic
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    
    // function for player movement
    this.movePlayer();
    
    // kill player if he is/falls outside world
    if(!this.player.inWorld && this.lives > 0) {
      this.playerDie();
    }
    
    // add enemies using timer
    if(this.nextEnemy < game.time.now) {
      var start = 3000, end = 1000, score = 100;
      var delay = Math.max(start - (start-end)*game.global.score/score, end);
      
      this.addEnemy();
      this.nextEnemy = game.time.now + delay;
    }
    
    //lifeup timer

    if(this.lifeUpTimer < game.time.now) {
      var delay = game.math.between(6000, 30000);
      
      this.addLifeUp();
      this.lifeUpTimer = game.time.now + delay;
    }
    

    
    
    game.physics.arcade.overlap(this.coin, this.player, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    game.physics.arcade.overlap(this.flag, this.player, this.nextLvl, null, this);
    game.physics.arcade.overlap(this.lifeCoin, this.player, this.takeLifeUp, null, this);
    
  },
  
  movePlayer: function() {
    if(this.cursor.left.isDown || this.moveLeft) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if(this.cursor.right.isDown || this.moveRight) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
    }
    if(this.cursor.up.isDown && this.player.body.onFloor()) {
      this.jumpPlayer();
    }
    
  },
  
  addLifeUp: function () {
    if(this.lifeCoin == undefined || !this.lifeCoin.alive) {
      this.lifeCoin = game.add.sprite(game.world.centerX, 220, 'lifeCoin');
      this.lifeCoin.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(this.lifeCoin);
    }
  },
  
  takeLifeUp: function() {
    this.lives += 1;
    this.lifeCoin.kill();
    this.livesLabel.text = 'Lives: ' + this.lives;
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
    var layerNumber = 'Tile Layer ' + game.global.lvlIndex; 
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer(layerNumber);
    this.layer.resizeWorld();
    this.map.setCollision([1, 2], true, layerNumber);

  },
  
  playerResurrect: function() {
    if(this.lives > 0) {
      this.player.reset(350, game.world.centerY);
    }
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
      this.lives -= 1;
      game.time.events.add(1000, this.playerResurrect, this);
    }
    
    if(this.lives < 1) {
      this.gameOver();
    }
    this.livesLabel.text = 'Lives: ' + this.lives;
  },
  
  gameOver: function() {
    this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER', { font: '32px Arial', fill: '#ffffff' });
    this.gameOverText.anchor.setTo(0.5, 0.5);
    game.add.tween(this.gameOverText.scale).to({ x: 2, y: 2}, 500).to({ x: 1.5, y: 1.5 }, 500).start();
    this.endScore = game.add.text(game.world.centerX, 280, 'Score: ' + game.global.score, { font: '32px Arial', fill: '#ffffff' });
    this.endScore.anchor.setTo(0.5, 0.5);
    game.plugins.cameraShake.shake();
    game.time.events.add(3000, this.toGameOver, this);
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
  
  toGameOver: function() {
    game.state.start('gameOver');
  },
  
  nextLvl: function() {
    if(game.global.lvlIndex == 4) {
      game.state.start('menu');
    } else {
      game.global.lvlIndex += 1;
      game.state.start('play');
    }
  },
  
  addMobileInputs: function() {
    this.jumpBtn = game.add.sprite(350, 247, 'jumpBtn');
    this.jumpBtn.inputEnabled = true;
    this.jumpBtn.alpha = 0.5;
    this.jumpBtn.events.onInputDown.add(this.jumpPlayer, this);
    
    this.moveLeft = false;
    this.moveRight = false;
    
    this.leftBtn = game.add.sprite(50, 247, 'leftBtn');
    this.leftBtn.inputEnabled = true;
    this.leftBtn.alpha = 0.5;
    this.leftBtn.events.onInputOver.add(function() { this.moveLeft = true; }, this);
    this.leftBtn.events.onInputOut.add(function() { this.moveLeft = false; }, this);
    this.leftBtn.events.onInputDown.add(function() { this.moveLeft = true; }, this);
    this.leftBtn.events.onInputUp.add(function() { this.moveLeft = false; }, this);

    
    this.rightBtn = game.add.sprite(130, 247, 'rightBtn');
    this.rightBtn.inputEnabled = true;
    this.rightBtn.alpha = 0.5;
    this.rightBtn.events.onInputOver.add(function() { this.moveRight = true; }, this);
    this.rightBtn.events.onInputOut.add(function() { this.moveRight = false; }, this);
    this.rightBtn.events.onInputDown.add(function() { this.moveRight = true; }, this);
    this.rightBtn.events.onInputUp.add(function() { this.moveRight = false; }, this);

  },
  
  jumpPlayer: function() {
    if(this.player.body.onFloor()) {
      this.player.body.velocity.y = -250;
      jumpsfx.play();
    }
  }
};
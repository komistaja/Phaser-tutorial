var lvl1 = {
  create: function () {
    game.global.lvlIndex = 1;
    this.cursor = game.input.keyboard.createCursorKeys();
    
    this.player = game.add.sprite(340, game.world.centerY, 'player2');
    game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.gravity.y = 270;
    this.player.body.bounce.y = 0.2;
    this.player.animations.add('right', [1, 2], 8, true);
    this.player.animations.add('left', [3, 4], 8, true);
    
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');
    
    this.createWorld();
    
    this.coin = game.add.sprite(80, 120, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5, 0.5);
    
    this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });
    
    this.lvlScore = 0;
    
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    game.physics.arcade.enable(this.enemies);
    this.enemies.createMultiple(10, 'enemy');
    
    this.nextEnemy = 0;
    
    jumpsfx = game.add.audio('jumpsfx');
    coinsfx = game.add.audio('coinsfx');
    deathsfx = game.add.audio('deadsfx');
    
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('pixel');
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setXSpeed(-150, 150);
    this.emitter.gravity = 0;
    
    
  },
  update: function () {
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    this.movePlayer();
    
    if(!this.player.inWorld) {
      this.playerDie();
    }
    
    if(this.nextEnemy < game.time.now) {
      var start = 3000, end = 1000, score = 100;
      var delay = Math.max(start - (start-end)*game.global.score/score, end);
      
      this.addEnemy();
      this.nextEnemy = game.time.now + delay;
    }
    
    if(this.lvlScore > 4) {
      this.flag = game.add.sprite(340, game.world.centerY, 'coin');
      game.physics.arcade.enable(this.flag);
      this.flag.anchor.setTo(0.5, 0.5);
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
    // create the tilemap
    this.map = game.add.tilemap('map1');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
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
    

    game.time.events.add(1000, this.startMenu, this);
  },
  
  startMenu: function() {
    game.state.start('menu');

  },
  
  nextLvl: function() {
    var lvlNumber = game.global.lvlIndex + 1;
    var next = 'lvl' + lvlNumber;
    game.state.start(next);
  }
}
var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(game.world.centerX, 150, 'Loading!', { font: '28px Sans Comic', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0,5);
    
    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);
    
    game.load.image('coin', 'assets/coin.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('bg', 'assets/background.png');
    game.load.image('jumpBtn', 'assets/jumpButton.png');
    game.load.image('leftBtn', 'assets/leftButton.png');
    game.load.spritesheet('muteBtn', 'assets/muteButton.png', 28, 22);
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('player', 'assets/player.png');
    game.load.spritesheet('player2', 'assets/player2.png', 20, 20);
    game.load.image('rightBtn', 'assets/rightButton.png');
    game.load.image('wallH', 'assets/wallHorizontal.png');
    game.load.image('wallV', 'assets/wallVertical.png');
    game.load.spritesheet('finish', 'assets/finish.png', 30, 20);
    game.load.spritesheet('enemy2', 'assets/enemy2.png', 20, 20);
    
    game.load.audio('coinsfx', 'assets/coin.mp3');
    game.load.audio('coinsfxogg', 'assets/coin.ogg');
    game.load.audio('deadsfx', 'assets/dead.mp3');
    game.load.audio('deadsfxogg', 'assets/dead.ogg');
    game.load.audio('jumpsfx', 'assets/jump.mp3');
    game.load.audio('jumpsfxogg', 'assets/jump.ogg');
    
    game.load.image('tileset', 'assets/tileset.png');
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
  },
  
  create: function() {
    game.state.start('menu');
  }
}
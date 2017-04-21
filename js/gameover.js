var gameOverState = {
  create: function() {
    game.add.image(0, 0, 'bg');
    
    var gameOverLabel = game.add.text(game.world.centerX, 80, 'GAME OVER N00B', { font: '50px Comic Sans', fill: '#ffffff' });
    gameOverLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(gameOverLabel.scale).to({x: 1.2, y: 1.2}, 300).to({x: 1, y: 1}, 300).loop().start();
    
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, { font: '25px Comic Sans', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);
    
    if(game.device.desktop) {
      startText = 'press the down-key to continue';
    } else {
      startText = 'touch screen to start';
    }
    
    var startLabel = game.add.text(game.world.centerX, game.world.height-80, startText, { font: '25px Sans Comic', fill: '#ffffff' });
    startLabel.anchor.setTo(0.5, 0.5);
    
    game.input.onDown.addOnce(this.menu, this);
    
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    
    downKey.onDown.addOnce(this.menu, this);
    
  },
  
  menu: function() {
    game.state.start('menu');
  }
}
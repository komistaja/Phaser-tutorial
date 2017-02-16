var menuState = {
  create: function() {
    game.add.image(0, 0, 'bg');
    
    var nameLabel = game.add.text(game.world.centerX, 80, 'Coin Box DHG15', { font: '50px Comic Sans', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, { font: '25px Comic Sans', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);
    
    var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'press up-key to start', { font: '25px Sans Comic', fill: '#ffffff' });
    startLabel.anchor.setTo(0.5, 0.5);
    
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    
    upKey.onDown.addOnce(this.start, this);
  },
  
  start: function() {
    game.state.start('play');
  }
}
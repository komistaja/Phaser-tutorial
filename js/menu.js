var menuState = {
  create: function() {
    game.add.image(0, 0, 'bg');
    
    var nameLabel = game.add.text(game.world.centerX, 80, 'Coin Box DHG15', { font: '50px Comic Sans', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, { font: '25px Comic Sans', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);
    
    if(!localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', 0);
    } 
    if(game.global.score > localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', game.global.score);
    }
    
    var highScore = game.add.text(game.world.centerX, game.world.height-140, 'highscore ' + localStorage.getItem('highscore'), { font: '25px Comic Sans', fill: '#ffffff' });
    highScore.anchor.setTo(0.5, 0.5);
    
    if(game.device.desktop) {
      startText = 'press the up-key to start';
    } else {
      startText = 'touch screen to start';
    }
    
    var startLabel = game.add.text(game.world.centerX, game.world.height-80, startText, { font: '25px Sans Comic', fill: '#ffffff' });
    startLabel.anchor.setTo(0.5, 0.5);
    
    game.add.tween(startLabel.scale).to({x: 1.1, y: 1.1}, 300).to({x: 1, y: 1}, 300).loop().start();
    
    this.muteBtn = game.add.button(20, 20, 'muteBtn', this.toggleSound, this);
    this.muteBtn.input.useHandCursor = true;
    
    if(game.sound.mute) {
      this.muteBtn.frame = 1;
    }
    
    game.input.onDown.addOnce(this.start, this);
    
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    
    upKey.onDown.addOnce(this.start, this);
  },
  
  start: function() {
    game.state.start('play');
  },
  
  toggleSound: function() {
    game.sound.mute = ! game.sound.mute;
    
    this.muteBtn.frame = game.sound.mute ? 1 : 0;
  }
}
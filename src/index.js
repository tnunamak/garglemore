import 'phaser';

import welcomeScene from './welcome.js';
import gameScene from './gameScene.js';

var config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 780,
  input: {
    gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      //debug: true
    }
  },
  scene: [welcomeScene, gameScene]
};

new Phaser.Game(config);

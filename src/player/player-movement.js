import 'phaser';
import constants from '../constants';

const { baseSpeed } = constants;
export default class playerMovement {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.playerSpeed = this.player.stats.speed;
  }
  
  checkMovement (gamepad) {
    if (gamepad) {
      this.checkGamepadMovement.apply(this, arguments)
    }
    else {
      this.oldCheckMovement.apply(this, arguments)
    }
  }

  checkGamepadMovement (gamepad) {
    
    let {x, y} = gamepad.leftStick
    let speed = this.playerSpeed * gamepad.leftStick.length()
    let angle = gamepad.leftStick.angle()

    this.player.setVelocityX(speed * Math.cos(angle));
    this.player.setVelocityY(speed * Math.sin(angle));

    let direction = 'right'
    if (x === 0 && y === 0) {
      this.player.anims.play('turn');
      return;
    }
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) direction = 'right'
      else if (x < 0) direction = 'left'
    }
    else {
      if (y > 0) direction = 'turn'
      else if (y < 0) direction = 'turn'
    }

    this.player.anims.play(direction, true);
  }

  // deprecated
  oldCheckMovement () {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);

      this.player.anims.play('left', true);
    }
    if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);

      this.player.anims.play('right', true);
    }
    if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
    }
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }
    if (!this.cursors.down.isDown && !this.cursors.up.isDown) {
      this.player.setVelocityY(0);
      this.player.anims.play('turn');
    }
  };
};

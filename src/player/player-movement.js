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

  getGamepadMovement (gamepad) {
    let {x, y} = gamepad.leftStick
    // TODO speed depend on player's speed attribute
    return {
      speed: this.playerSpeed * gamepad.leftStick.length(),
      angle: gamepad.leftStick.angle()
    }
  }

  updateGamepadMovement (gamepad) {
    let { speed, angle } = this.getGamepadMovement(gamepad)
    this.updateMovement(speed, angle)
  }

  updateMovement (speed, angle) {
    this.player.setVelocityX(speed * Math.cos(angle));
    this.player.setVelocityY(speed * Math.sin(angle));

    let direction = 'turn'
    angle = angle + (Math.PI / 4)
    if (angle >= 0 && angle < Math.PI / 2) {
      direction = 'right'
    }
    else if (angle >= Math.PI / 2 && angle < Math.PI) {
      direction = 'turn'
    }
    else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      direction = 'left'
    }
    else {
      direction = 'turn'
    }

    try {
      this.player.anims.play(direction, true);
    }
    catch (e) {
      // Don't crash if the animation doesn't exist
    }
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

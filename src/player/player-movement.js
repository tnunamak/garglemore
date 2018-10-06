import 'phaser';

export default class playerMovement {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.cursors = scene.input.keyboard.createCursorKeys();
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
    // TODO speed depend on player's speed attribute
    let speed = 300 * gamepad.leftStick.length()
    let angle = gamepad.leftStick.angle()

    this.player.setVelocityX(speed * Math.cos(angle));
    this.player.setVelocityY(speed * Math.sin(angle));

    let direction = 'right'
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) direction = 'right'
      else if (x < 0) direction = 'left'
    }
    else {
      if (y > 0) direction = 'down'
      else if (y < 0) direction = 'up'
    }

    this.player.anims.play(direction, true);
  }

  // deprecated
  oldCheckMovement () {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    }
    if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    }
    if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
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

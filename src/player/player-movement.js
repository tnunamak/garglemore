import 'phaser';

export default class playerMovement {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  checkMovement () {
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
export default new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Bullet (scene) {
    this.scene = scene
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

    this.speed = Phaser.Math.GetSpeed(1000, 1);
    this.angle = 0;
  },

  fire: function (x, y, angle) {
    this.angle = angle;
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  },

  update: function (time, delta) {
    this.x += this.speed * delta * Math.cos(this.angle)
    this.y += this.speed * delta * Math.sin(this.angle)

    if (this.y < -50 || this.y > this.scene.game.canvas.height || this.x < -50 || this.x > this.scene.game.canvas.width) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
})

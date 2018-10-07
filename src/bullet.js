export default new Phaser.Class({
  Extends: Phaser.Physics.Arcade.Sprite,

  initialize: function Bullet (scene) {
    this.scene = scene
    Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'bullet');

    this.speed = Phaser.Math.GetSpeed(1000, 1);
    this.angle = 0;
    scene.physics.add.existing(this)
  },

  fire: function (x, y, angle) {
    this.angle = angle;
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  },

  fireAtPlayers: function (creature, angle, targetSprites) {
    this.angle = angle;
    this.setPosition(creature.sprite.x, creature.sprite.y);

    this.setActive(true);
    this.setVisible(true);
    for (var i = 0; i < targetSprites.length; i++) {
      let playerSprite = targetSprites[i];
      let collider  = this.scene.physics.add.collider(this, playerSprite, this.callbackFunction(creature));
    }
  },

  callbackFunction: function (creature){
    return function(bullet, player){
      // console.log("HIT", [player, creature]); 
      // TODO
    } 
  },

  update: function (time, delta) {
    this.x += this.speed * delta * Math.cos(this.angle)
    this.y += this.speed * delta * Math.sin(this.angle)

    if (this.y < -50 || this.y > this.scene.game.canvas.height || this.x < -50 || this.x > this.scene.game.canvas.width) {
      this.setActive(false);
      this.setVisible(false);
    }

    //console.log(this.scene.physics.overlap(this))
  }
})

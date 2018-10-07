import { damagePlayer } from './player/player-stats'
import constants from './constants';

export default new Phaser.Class({
  Extends: Phaser.Physics.Arcade.Sprite,

  initialize: function Bullet (scene) {
    this.scene = scene
    Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'bullet');

    this.speed = Phaser.Math.GetSpeed(1000, 1);
    this.angle = 0;
    scene.physics.add.existing(this)
  },

  fireAtCreatures: function (player, targetCreatures, angle) {
    this.angle = angle;
    this.setPosition(player.x, player.y);

    this.setActive(true);
    this.setVisible(true);
    for (var i = 0; i < targetCreatures.length; i++) {
      let creature  = targetCreatures[i];
      let collider  = this.scene.physics.add.collider(this, creature.sprite, this.bulletHitsCreature(player));
    }
  },

  fireAtPlayers: function (creature, targetSprites, angle) {
    this.angle = angle;
    this.setPosition(creature.sprite.x, creature.sprite.y);

    this.setActive(true);
    this.setVisible(true);
    for (var i = 0; i < targetSprites.length; i++) {
      let playerSprite = targetSprites[i];
      let collider  = this.scene.physics.add.collider(this, playerSprite, this.bulletHitsPlayer(creature));
    }
  },

  bulletHitsCreature: function (player){
    let bullet = this
    return function(bullet, creature){
      let attackDamage = player.stats.attack * constants.bulletDamageFactor
      creature.damage(attackDamage)

      bullet.setActive(false);
      bullet.setVisible(false);
    } 
  },

  bulletHitsPlayer: function (creature){
    let bullet = this
    return function(bullet, player){
      let attackDamage = creature.stats.attack * constants.bulletDamageFactor
      damagePlayer(player, attackDamage)

      bullet.setActive(false);
      bullet.setVisible(false);
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

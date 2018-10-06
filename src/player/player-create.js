import 'Phaser';
import getStats from '../stats'
import archetypes from '../archetypes.js'
import Cursors from './player-movement.js'


export function createPlayer (scene, archetype = archetypes.shooter) {
  const startingLevel = 6;
  let player = scene.physics.add.sprite(100, 450, 'dude');
  player.stats = getStats(startingLevel, archetype.modifiers)
  player.stats.maxHealth = player.stats.health;
  player.stats.level = startingLevel;

  player.setCollideWorldBounds(true);

  scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
  });

  scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  // physics interactions
  const walls = scene.data.get('walls');
  walls.forEach(wall => {
    scene.physics.add.collider(player, wall)
  });

  return player;
};

export function joinPlayer(pad) {
    let player = createPlayer(this);

    let movement = new Cursors(this, player, pad);
    player.setCollideWorldBounds(true);

    return {
        player,
        movement
    }
}
import 'Phaser';
import getStats from '../stats'
import archetypes from '../archetypes.js'

export function createPlayer (scene, archetype = archetypes.shooter) {
  const startingLevel = 6;
  let player = scene.physics.add.sprite(100, 450, 'dude');
  player.stats = getStats(startingLevel, archetype.modifiers)
  player.stats.maxHealth = player.stats.health;
  player.stats.level = startingLevel;

  scene.data.set('player', player);
  scene.data.set('playerStats', player.stats);

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

  return player;
};
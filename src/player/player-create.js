import 'phaser';
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
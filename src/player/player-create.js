import getStats from '../stats'
import archetypes from '../archetypes.js'
import Cursors from './player-movement.js'

export const startingLevel = 6

export function createPlayer (scene, type = 'shooter') {
  let player = scene.physics.add.sprite(
    scene.game.canvas.width / 2,
    scene.game.canvas.height / 2,
    'dude'
  ).setOrigin(0.5, 0.5);

  player.update = (level, newType) => updatePlayer(player, level, newType)

  // physics interactions
  player.setCollideWorldBounds(true);

  const walls = scene.data.get('walls');
  walls.forEach(wall => {
    scene.physics.add.collider(player, wall)
  });

  player.update(startingLevel, type)
  return player;
};

export function destroyPlayer(scene, player){
  alert('DEAD');
  console.log(scene.data.get('players'));
  // Get by player number 
  // Todo
}

export function updatePlayer (player, level, type) {
  const archetype   = archetypes[type]
  player.stats      = getStats(level, archetype.modifiers)
  player.archetype  = archetype
  player.setTint(archetype.color)

  return player
}

export function joinPlayer(pad) {
    let player = createPlayer(this);

    let movement = new Cursors(this, player, pad);
    player.setCollideWorldBounds(true);

    return {
        player,
        movement
    }
}

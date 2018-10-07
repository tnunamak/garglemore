import archetypes from '../archetypes.js'
import { scaleStatsToLevel } from '../stats'

export function updatePlayerStats(player){
  if(! player.lastKilled)
    return;

  player.stats.level += 1
  applyArchetypeToPlayer(player, player.lastKilled);
}

export function damagePlayer (player, attackDamage) {
    if(player.stats.health < 0){
      return
    }

    player.stats.health = player.stats.health - attackDamage
}

export function isPlayerDead (player){
	return player.stats.health <= 0;
}

function applyArchetypeToPlayer(player, creature) {
  let newStats = scaleStatsToLevel(creature.stats, player.stats.level)
  player.stats = newStats
  player.archetype = creature.archetype
  player.setTint(creature.archetype.color)
}
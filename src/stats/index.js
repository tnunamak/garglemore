const constants = require('../constants.js').default;

// How strong the leveling effect is.
const LEVEL_SCALING_FACTOR = 0.05
// How random individual stats can be.
const FUZZ_VARIANCE = 0.05

const statBases = require('./statBases')
const normalDistribution = require('./normalNumbers.js')

export function scaleStatsToLevel(stats, newLevel) {
  let oldLevel = stats.level;
  let newStats = {}; 
  for (let baseStatName in statBases) {
    let oldValue  = stats[baseStatName]
    if (baseStatName == "health") {
      oldValue = stats["maxHealth"]
    }
    let baseValue = statBases[baseStatName]
    let newValue  = scaleStat(baseValue, oldLevel, oldValue, newLevel, LEVEL_SCALING_FACTOR)
    newStats[baseStatName] = newValue
  }
  
  newStats.maxHealth = newStats.health;
  newStats.level     = newLevel;
  return newStats
}

export default function getStats (level, modifiers) {
  const statKeys = Object.keys(statBases)
  let stats = statKeys.reduce((acc, stat) => {
    acc[stat] = Math.round(computeStat(stat, level, modifiers[stat] || 0));
    return acc
  }, {})

  stats.maxHealth = stats.health;
  stats.level     = level;
  return stats
}

function computeStat (stat, level, baseModifier) {
  const base = statBases[stat]
  const modifier = chooseModifier(baseModifier)

  return statFn(base, level, LEVEL_SCALING_FACTOR, modifier)
}

function statFn (base, level, scalingFactor, modifier) {
  const statRatio = base + level * (scalingFactor + modifier)
  return Math.round(statRatio * constants.baseStatValue)
}

function scaleStat (base, oldLevel, oldValue, newLevel, scalingFactor){
  const oldRatio = oldValue / constants.baseStatValue
  let modifier = ((oldRatio - base)  / oldLevel) - scalingFactor;
  return statFn(base, newLevel, scalingFactor, modifier)
}

function chooseModifier (base) {
  const min = -FUZZ_VARIANCE
  const max = FUZZ_VARIANCE
  const stretch = normalDistribution[Math.floor(Math.random() * normalDistribution.length)]
  const fuzzBy = (min + stretch * (max - min))

  return Math.abs(base + fuzzBy)
}

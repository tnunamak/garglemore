const constants = require('../constants.js').default;

// How strong the leveling effect is.
const LEVEL_SCALING_FACTOR = 0.05
// How random individual stats can be.
const FUZZ_VARIANCE = 0.05

const statBases = require('./statBases')
const normalDistribution = require('./normalNumbers.js')

module.exports = function getStat (level, modifiers) {
  const stats = Object.keys(statBases)
  return stats.reduce((acc, stat) => {
    acc[stat] = Math.round(computeStat(stat, level, modifiers[stat] || 0) * constants.baseStatValue);
    return acc
  }, {})
}

function computeStat (stat, level, baseModifier) {
  const base = statBases[stat]
  const modifier = chooseModifier(baseModifier)

  return statFn(base, level, LEVEL_SCALING_FACTOR, modifier)
}

function statFn (base, level, scalingFactor, modifier) {
  return base + level * (scalingFactor + modifier)
}

function chooseModifier (base) {
  const min = -FUZZ_VARIANCE
  const max = FUZZ_VARIANCE
  const stretch = normalDistribution[Math.floor(Math.random() * normalDistribution.length)]
  const fuzzBy = (min + stretch * (max - min))

  return Math.abs(base + fuzzBy)
}

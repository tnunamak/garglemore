// Generates a list of numbers normally distributed between (0, 1)
const COUNT = 10000;
const mean = 0;
const variance = 1 / (2 * Math.PI);

var gaussian = require('gaussian');
var distribution = gaussian(mean, variance);
// Take a random sample using inverse transform sampling method.
var sample = distribution.ppf(Math.random());

const values = []
for (var i = 1; i < COUNT; i++) {
  const n = (1 / COUNT) * i
  values.push(distribution.ppf(n))
}

const normalizer = 1 / (values[values.length - 1] - values[0])
const normalizedValues = values.map(n => n * normalizer + 0.5)

console.log(JSON.stringify(normalizedValues))

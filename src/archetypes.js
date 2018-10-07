const SHOOTER_DISTANCE = 300

// Modifiers are small numbers that represent
// how much more of an attribute this type of
// character has than others.
module.exports = {
  shooter: {
    // TODO replace this with unique sprites
    color: 0xff0000,
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    },
    ai: {
      // Returns a unit vector in the direction movement should occur. Returns
      // the zero vector if movement is not necessary.
      stepToward: (self, enemies) => {
        let closest
        let closestDistance = 99999
        enemies.forEach(enemy => {
          let distanceSq = Phaser.Math.Distance.Squared(enemy.x, enemy.y, self.sprite.x, self.sprite.y)

          if (!closest || distanceSq < closestDistance) {
            closest = enemy
            closestDistance = distanceSq
          }
        })

        const closeEnough = closestDistance <= (SHOOTER_DISTANCE * SHOOTER_DISTANCE)

        const vectorTowards = new Phaser.Math.Vector2(closest.x - self.sprite.x, closest.y - self.sprite.y).normalize()

        return closeEnough ? Phaser.Math.Vector2.ZERO : vectorTowards
      },
      attack: (self, enemies) => {

      }
    }
  },
  dasher: {
    color: 0x00ff00,
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    }
  },
  grenadier: {
    color: 0x0000ff,
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    }
  },
  kamikaze: {
    color: 0xffff00,
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    }
  }
}

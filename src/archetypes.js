import mechanics from './mechanics'

const SHOOTER_DISTANCE = 300
const DASHER_DISTANCE = 300
const DASHER_COOLDOWN = 750

export const closestTarget = (self, enemies) => {
  let closest
  let closestDistance = 99999
  enemies.forEach(enemy => {
    let distanceSq = Phaser.Math.Distance.Squared(enemy.x, enemy.y, self.x, self.y)

    if (!closest || distanceSq < closestDistance) {
      closest = enemy
      closestDistance = distanceSq
    }
  })

  return closest
}

const chooseMove = (self, enemies, distance) => {
  const closest = closestTarget(self.sprite, enemies)
  const closestDistance = Phaser.Math.Distance.Squared(self.sprite.x, self.sprite.y, closest.x, closest.y,)
  const closeEnough = closestDistance <= (distance * distance)

  const vector = vectorTowards(self.sprite, closest)

  self.animateMovement(closest)

  return closeEnough ? Phaser.Math.Vector2.ZERO : vector
}

const vectorTowards = (from, to) => new Phaser.Math.Vector2(to.x - from.x, to.y - from.y).normalize()

// Modifiers are small numbers that represent
// how much more of an attribute this type of
// character has than others.
export default {
  shooter: {
    // TODO replace this with unique sprites
    color: 0xff0000,
    name: "Shooter",
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    },
    ai: {
      setup: (self, scene) => {
        // 150 is the cooldown
        self.gun = mechanics.getGun(scene.data.get('bullets'), 150)
      },
      // Returns a unit vector in the direction movement should occur. Returns
      // the zero vector if movement is not necessary.
      stepToward: (self, enemies) => {
        return chooseMove(self, enemies, SHOOTER_DISTANCE)
      },
      attack: (self, enemies) => {
        if (!self.gun) {
          return
        }

        const target = closestTarget(self.sprite, enemies)

        self.gun.fire(self.sprite.x, self.sprite.y, vectorTowards(self.sprite, target).angle())
      }
    }
  },
  dasher: {
    color: 0x00ff00,
    name: "Dasher",
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    },
    ai: {
      setup: (self, scene) => {
        self.dashPower = mechanics.getDashPower(self.sprite, DASHER_COOLDOWN)
        self.scene = scene
      },
      stepToward: (self, enemies) => {
        return chooseMove(self, enemies, DASHER_DISTANCE)
      },
      attack: (self, enemies) => {
        if (self.dashPower.dashActive) {
          self.dashPower.update()
        } else {
          const target = closestTarget(self.sprite, enemies)
          self.dashPower.start(
            self.scene,
            vectorTowards(self.sprite, target).angle(),
            self,
            enemies
          )
        }
      }
    }
  },
  grenadier: {
    color: 0xffff00,
    name: "Laserbeast",
    modifiers: {
      health: 0.03,
      speed: 0.06,
      attack: 0.005
    }
  }
}

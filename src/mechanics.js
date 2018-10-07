import constants from './constants'

const mechanicsState = new WeakMap()

function getStateFor (character) {
  if (mechanicsState.has(character)) {
    return mechanicsState.get(character)
  }
  else {
    const state = {}
    mechanicsState.add(character, state)
  }
}

class Behavior {
  constructor (cooldown) {
    this.cooldown = cooldown
    this.lastInvoked = 0
  }

  tryAction () {
    const now = Date.now()
    const over = now > this.lastInvoked + this.cooldown
    if (over) {
      this.lastInvoked = now
    }

    return over
  }
}

class Gun extends Behavior {
  constructor (bullets, cooldown) {
    super(cooldown)
    this.bullets = bullets
  }

  fireAtCreatures (player, creatures, angle) {
    if (!this.tryAction()) {
      return
    }

    const bullet = this.bullets.get()
    bullet.target = "creatures"
    if (bullet) {
      let newAngle = angle ? angle : this.lastFireAngle
      this.lastFireAngle = newAngle
      bullet.fireAtCreatures(player, creatures, newAngle)
    }
  }

  fireAtPlayers(creature, playerSprites, angle){
    const now = Date.now()
    if (now < this.lastFired + this.cooldown) {
      return
    }
    const bullet = this.bullets.get()
    bullet.target = "players"
    if (bullet) {
      this.lastFired = now
      let newAngle = angle ? angle : this.lastFireAngle
      this.lastFireAngle = newAngle
      bullet.fireAtPlayers(creature, playerSprites, newAngle)
    }
  }
}

class DashBehavior extends Behavior {
  constructor (sprite, cooldown) {
    super(cooldown)
    this.sprite = sprite
    // TODO fix
    this.speed = 500;
  }

  // targets must have isHealthy(), damage(amt) fns
  start (scene, angle, attacker, targets) {
    const DASH_FACTOR = 5

    if (!this.tryAction()) {
      return
    }
    if (this.colliders) {
      this.colliders.forEach(c => c.world && c.destroy())
    }

    this.colliders = []
    targets && targets.forEach(target => {
      const collider = scene.physics.add.collider(attacker.sprite || attacker, target.sprite || target, () => {
        if (collider.hasActivated) {
          return
        }

        target.damage(attacker.stats.attack * constants.dashDamageFactor)
        collider.hasActivated = true
        if (!target.isHealthy()) {
          attacker.lastKilled = target
        }

        collider.world && collider.destroy()
      })

      collider.hasActivated = false
      this.colliders.push(collider)

      setTimeout(() => collider.hasActivated = true, 300)
    })

    this.dashActive = true
    setTimeout(() => {
      this.colliders && this.colliders.forEach(c => c.world && c.destroy())
      delete this.colliders
      this.dashActive = false
    }, 80)

    this.update = () => {
      if (this.dashActive) {
        this.updateMovement(this.speed * DASH_FACTOR, angle)
        return true
      }

      return false
    }

    this.update()
  }

  updateMovement (speed, angle) {
    this.sprite.setVelocityX(speed * Math.cos(angle));
    this.sprite.setVelocityY(speed * Math.sin(angle));

    let direction = 'turn'
    angle = angle + (Math.PI / 4)
    if (angle >= 0 && angle < Math.PI / 2) {
      direction = 'right'
    }
    else if (angle >= Math.PI / 2 && angle < Math.PI) {
      direction = 'turn'
    }
    else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      direction = 'left'
    }
    else {
      direction = 'turn'
    }

    try {
      this.sprite.anims.play(direction, true);
    }
    catch (e) {
      // Don't crash if the animation doesn't exist
    }
  }
}

export default {
  getGun: function (bullets, cooldown) {
    return new Gun(bullets, cooldown)
  },
  getDashPower: function (sprite, cooldown) {
    return new DashBehavior(sprite, cooldown)
  }
}

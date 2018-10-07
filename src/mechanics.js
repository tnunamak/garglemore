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

class Gun {
  constructor (bullets, cooldown) {
    this.bullets = bullets
    this.cooldown = cooldown
    this.lastFired = 0
  }

  fire (x, y, angle) {
    const now = Date.now()
    if (now < this.lastFired + this.cooldown) {
      return
    }

    const bullet = this.bullets.get()
    if (bullet) {
      this.lastFired = now
      let newAngle = angle ? angle : this.lastFireAngle
      this.lastFireAngle = newAngle
      bullet.fire(x, y, newAngle)
    }
  }
}

export default {
  getGun: function (bullets, cooldown) {
    return new Gun(bullets, cooldown)
  }
}

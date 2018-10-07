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

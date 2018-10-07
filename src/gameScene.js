import 'phaser';

import archetypes from './archetypes'
import { scaleStatsToLevel } from './stats'
import { joinPlayer } from './player/player-create.js'
import { addAnimations } from './animations.js'
import Creature from './creature';
import Cursors from './player/player-movement.js'
import DynamicGroup from './dynamicGroup';
import Bullet from './bullet'
import mechanics from './mechanics'

let creatureGroup;
let displayStats = [];
let bullets;
let players = new Map();
let timer;
let timerText;

class Main extends Phaser.Scene {

  constructor() {
    super({ key: 'gameScene' });
  }

  preload() {
    this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('zombie', 'public/assets/zombie.png', { frameWidth: 32, frameHeight: 42 });
    this.load.spritesheet('bullet', 'public/assets/rgblaser.png', { frameWidth: 4, frameHeight: 4 });
  }

  create() {
    this.data.set('players', players);
    const horizontalWalls = this.physics.add.staticGroup();
    const verticalWalls = this.physics.add.staticGroup();
    this.data.set('walls', [horizontalWalls, verticalWalls])
    timerText = this.add.text(640 - 36, 320, '', { font: '96px Courier', fill: '#00ff00' });

    // player join listener
    this.input.gamepad.on('down', function (pad, button, index) {
      if (!players.has(pad)) {
        const joinedPlayerAndMovement = joinPlayer.bind(this)(pad);
        const { player, movement } = joinedPlayerAndMovement;

        // TODO: Apply this at the right time.
        joinedPlayerAndMovement.gun = mechanics.getGun(bullets, 50)
        joinedPlayerAndMovement.dashPower = mechanics.getDashPower(player, 150)

        player.playerNumber = players.size;
        players.set(pad, joinedPlayerAndMovement);
        displayStats.push(this.add.text(50, 60 * players.size, '', { font: '12px Courier', fill: '#00ff00' }));
        timer = this.time.delayedCall(1400, addNewCreatureGroup, [], this);
      }
    }, this)

    this.input.gamepad.on('down', function (pad, button, index) {
      if (button.index === 2) {
        if (!creatureGroup) return;
        let creatureGroupChildren = creatureGroup.children;
        let removalIndices = [];
        for (let [index, child] of creatureGroupChildren.entries()) {
          removalIndices.push(index);
        };
        removalIndices = removalIndices.reverse();
        removalIndices.forEach(index => {
          if (creatureGroup.renderGroup[index]) creatureGroupChildren[index].destroy();
          Phaser.Utils.Array.Remove(creatureGroup.children, creatureGroup.children[index]);
        })
      }
    })

    for (let i = 1; i <= 20; i++) {
      horizontalWalls.create(i * 60 - 30, 0, 'horizontal_wall');
      horizontalWalls.create(i * 60 - 30, 780, 'horizontal_wall');
      verticalWalls.create(0, i * 60 - 30, 'vertical_wall');
      verticalWalls.create(1200, i * 60 - 30, 'vertical_wall');
    }

    // add animations
    addAnimations(this);

    bullets = this.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: true
    })

    this.data.set('bullets', bullets);
  }

  update(time, delta) {
    if (!players.size) {
      return
    }
    players.forEach((playerData, gamepad) => updatePlayer.bind(this)(playerData, gamepad, time, delta))
    // creatures
    if (creatureGroup) {
      creatureGroup.removeDeadChildren();
      const resetGroup = creatureGroup.isEveryChildDestroyed();
      if (!resetGroup) {
        creatureGroup.update(Array.from(players.values()).map(playerData => playerData.player))
      }
      else {
        if (!timer || isTimerComplete()) {
          players.forEach((playerData, gamepad) => updatePlayerForWave(playerData, gamepad, time, delta))

          // create new wave and replace
          timer = this.time.delayedCall(4000, addNewCreatureGroup, [], this)
        }
      }
    }
  }
}

function updatePlayer({ player, movement, gun, dashPower }, gamepad, time, delta) {
  updateDisplay(player);

  let movementFromInput = true
  if (dashPower && gamepad.A && !dashPower.dashActive) {
    // todo is creatureGroupChildren correct?
    dashPower.start(this, movement.getGamepadMovement(gamepad).angle, player, creatureGroup && creatureGroup.children)
  }
  else if (dashPower) {
    movementFromInput = !dashPower.update()
  }

  movementFromInput && movement.updateGamepadMovement(gamepad);

  if (gun && gamepad.R2) {
    gun.fire(player.x, player.y, gamepad.rightStick.angle())
  }
}

function updatePlayerForWave(playerData, gamepad, time, delta) {
  let player = playerData.player
  if(! player.lastKilled)
    return;
  player.stats.level += 1
  applyArchetypeToPlayer(player, player.lastKilled);
}

function applyArchetypeToPlayer(player, creature) {
  let newStats = scaleStatsToLevel(creature.stats, player.stats.level)
  player.stats = newStats
  player.archetype = creature.archetype
  player.setTint(creature.archetype.color)
}

function updateDisplay(player) {
  displayStats[player.playerNumber].setText([
    `Player ${player.playerNumber}`,
    `Level: ${player.stats.level - 5}`,
    `Health: ${player.stats.health}/${player.stats.maxHealth}`,
    `Speed: ${player.stats.speed}`,
    `Attack: ${player.stats.attack}`,
    player.archetype ? `Archetype: ${player.archetype.name}` : null,
  ]);

  if (timer && timer.getProgress() !== 1) {
    timerText.setText((timer.getProgress() * 4).toString().substr(0, 1));
  } else {
    timerText.setText('');
  }
}

function addNewCreatureGroup(scene = this) {
  let creatures = [];

  for (var i = 0; i < 10; i++) {
    const x = Phaser.Math.Between(50, 1150);
    const y = Phaser.Math.Between(50, 730);

    let type = Object.keys(archetypes)[Math.floor(Math.random() * Object.keys(archetypes).length)]
    let typeData = archetypes[type]

    // TODO update level based on wave, etc.
    creatures.push(new Creature(scene, x, y, 1, type));
  }

  creatureGroup = new DynamicGroup(scene, creatures);
  scene.data.get('walls').forEach(wall => creatureGroup.collidesWith(wall));
  scene.data.get('players').forEach(player => creatureGroup.collidesWith(player));
  spawnWavesOfCreatures(creatureGroup);

  timer = undefined;
}

function spawnWavesOfCreatures(creatureGroup) {
  const batchCount = 3;
  // array[Math.floor(Math.random() * array.length)]
  const totalLength = creatureGroup.children.filter((child) => !child.isRendered).length;
  for(let i = 0; i < batchCount; i++) {
    setTimeout(() => {
      // get all unrendered children
      let unrenderedChildren = creatureGroup.children.filter((child) => !child.isRendered);
      const isLastBatch = i === batchCount - 1;
      let jlast = totalLength / batchCount;
      if (isLastBatch) jlast = unrenderedChildren.length;
      for (let j = 0; j < jlast; j++) {
        const child = Phaser.Utils.Array.RemoveRandomElement(unrenderedChildren);
        child.renderSelf();
        creatureGroup.addChildToRenderGroup(child)
      }
    }, 4000 * i)
  }
}

function isTimerComplete() {
  return timer.getProgress() === 1;
}

export default new Main();

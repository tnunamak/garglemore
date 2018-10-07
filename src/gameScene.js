import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import { joinPlayer } from './player/player-create.js'
import { addAnimations } from './animations.js'
import Creature from './creature';
import Cursors from './player/player-movement.js'
import DynamicGroup from './dynamicGroup';
import Bullet from './bullet'

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
        const { player } = joinedPlayerAndMovement;
        player.playerNumber = players.size;
        players.set(pad, joinedPlayerAndMovement);
        displayStats.push(this.add.text(50, 60 * players.size, '', { font: '12px Courier', fill: '#00ff00' }));
        timer = this.time.delayedCall(4000, addNewCreatureGroup, [], this);
      }
    }, this)

    this.input.gamepad.on('down', function (pad, button, index) {
      if (button.index === 2) {
        if (!creatureGroup) return;
        let creatureGroupChildren = creatureGroup.renderGroup.getChildren();
        let removalIndices = [];
        for (let [index, child] of creatureGroupChildren.entries()) {
          removalIndices.push(index);
        };
        removalIndices = removalIndices.reverse();
        removalIndices.forEach(index => {
          creatureGroupChildren[index].destroy();
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
  }

  update(time, delta) {
    if (!players.size) {
      return
    }
    players.forEach((playerData, gamepad) => updatePlayer(playerData, gamepad, time, delta))
    // creatures
    if (creatureGroup) {
      const waveData = creatureGroup.isEveryChildDestroyed();
      if (!waveData.resetGroup) {
        creatureGroup.updateMovement(Array.from(players.values()).map(playerData => playerData.player))
      }
      else {
        console.log(!timer || isTimerComplete())
        if (!timer || isTimerComplete()) {
          // use last monster data

          // create new wave and replace
          timer = this.time.delayedCall(3000, addNewCreatureGroup, [], this)
        }
      }
    }
  }
}

function genCreatureStats(level, type) {
  return getStats(level, archetypes[type].modifiers)
}

function updatePlayer({ player, movement }, gamepad, time, delta) {
  movement.updateGamepadMovement(gamepad);

  // display
  updateDisplay(player);

  if (gamepad.A && !player.dash && player.canDash !== false) {
    movement.updateDashStatus(player, gamepad);
  }

  if (player.dash) {
    const DASH_FACTOR = 5
    let { speed, angle } = player.dash
    movement.updateMovement(speed * DASH_FACTOR, angle)
  }
  // abstract out gun cooldown (150)
  if (gamepad.R2 && time > (player.lastFired || 0) + 50) {
    let bullet = bullets.get()
    let angle = (gamepad.rightStick.x === 0 && gamepad.rightStick.y === 0 && player.lastFireAngle) ? player.lastFireAngle : gamepad.rightStick.angle()

    if (bullet) {
      player.lastFired = time
      player.lastFireAngle = angle
      bullet.fire(player.x, player.y, angle)
    }
  }
}

function updateDisplay(player) {
  displayStats[player.playerNumber].setText([
    `Player ${player.playerNumber}`,
    `Level: ${player.stats.level - 5}`,
    `Health: ${player.stats.health}/${player.stats.maxHealth}`,
    `Speed: ${player.stats.speed}`,
    `Attack: ${player.stats.attack}`,
    player.archetype ? `Archetype: ${player.archetype}` : null,
  ]);

  if (timer && timer.getProgress() !== 1) {
    timerText.setText((timer.getProgress() * 3).toString().substr(0, 1));
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

  timer = undefined;
}

function isTimerComplete() {
  return timer.getProgress() === 1;
}

export default new Main();
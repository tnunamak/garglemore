import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import Cursors from './player/player-movement.js'

function makeCharacter(level, type) {
    getStats(level, archetypes[type].modifiers)
}

var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 780,
    input: {
      gamepad: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [{
        preload: preload,
        create: create,
        update: update
    }]
};

let player;
let stars;
let platforms;
let horizontalWalls;
let verticalWalls;

let game = new Phaser.Game(config);

function preload() {
    this.load.image('star', 'public/assets/star.png');
    this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function joinPlayer (pad) {
  player = this.physics.add.sprite(100, 450, 'dude');

  let movement = new Cursors(this, player, pad);
  player.setCollideWorldBounds(true);

  // physics interactions
  this.physics.add.collider(player, horizontalWalls);
  this.physics.add.collider(player, verticalWalls);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  return {
    player,
    movement
  }
}

const players = new Map()

function create () {
  //Create all the things
  horizontalWalls = this.physics.add.staticGroup();
  verticalWalls = this.physics.add.staticGroup();
  this.input.gamepad.on('down', function (pad, button, index) {
    if (!players.has(pad)) {
      players.set(pad, joinPlayer.bind(this)(pad))
    }
  }, this)

  for (let i = 1; i <= 20; i++) {
    horizontalWalls.create(i * 60 - 30, 0, 'horizontal_wall');
    horizontalWalls.create(i * 60 - 30, 780, 'horizontal_wall');
    verticalWalls.create(0, i * 60 - 30, 'vertical_wall');
    verticalWalls.create(1200, i * 60 - 30, 'vertical_wall');
  }

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  this.physics.add.collider(stars, horizontalWalls);

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
}

function update() {
  if (!players.size) {
    return
  }
  players.forEach(updatePlayer)
}

function updatePlayer ({ player, movement }, gamepad) {
  movement.checkMovement(gamepad);

  //if (gamepad.A && player.body.velocity.y >= 0) {
    //player.setVelocityY(-330);
  //}
}

function collectStar(player, star) {
    star.disableBody(true, true);
}

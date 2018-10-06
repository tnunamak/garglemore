import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import Creature         from './creature';
import Cursors from './player/player-movement.js'
import DynamicGroup    from './dynamicGroup';

function makeCharacter(level, type) {
    getStats(level, archetypes[type].modifiers)
}

var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 780,
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
var creatureGroup;
let playerMovement;
let horizontalWalls;
let verticalWalls;

let game = new Phaser.Game(config);

function preload() {
  this.load.image('star', 'public/assets/star.png');
  this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
  this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
  this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('zombie', 'public/assets/zombie.png', { frameWidth: 32, frameHeight: 42 });
}

function create() {
    //Create all the things
    horizontalWalls = this.physics.add.staticGroup();
    verticalWalls = this.physics.add.staticGroup();

    player = this.physics.add.sprite(100, 450, 'dude');
    
    for (let i = 1; i <= 20; i++) {
        horizontalWalls.create(i * 60 - 30, 0, 'horizontal_wall');
        horizontalWalls.create(i * 60 - 30, 780, 'horizontal_wall');
        verticalWalls.create(0, i * 60 - 30, 'vertical_wall');
        verticalWalls.create(1200, i * 60 - 30, 'vertical_wall');
    }
    
    // player
    playerMovement = new Cursors(this, player);
    player.setCollideWorldBounds(true);

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

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // physics interactions
    this.physics.add.collider(player, horizontalWalls);
    this.physics.add.collider(player, verticalWalls);
    this.physics.add.collider(stars, horizontalWalls);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.anims.create({
        key: 'zombie-down',
        frames: this.anims.generateFrameNumbers('zombie', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'zombie-left',
        frames: this.anims.generateFrameNumbers('zombie', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'zombie-right',
        frames: this.anims.generateFrameNumbers('zombie', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'zombie-up',
        frames: this.anims.generateFrameNumbers('zombie', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    let creatures = [];

    for (var i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(50, 1150);
        const y = Phaser.Math.Between(50, 730);

        let stats = {
          health: Phaser.Math.Between(1, 100) / 100,
          speed: Phaser.Math.Between(1, 100) / 100,
          attack: Phaser.Math.Between(1, 100) / 100
        }

        creatures.push(new Creature(this, x, y, stats));
    }

    creatureGroup = new DynamicGroup(this, creatures);
    creatureGroup.collidesWith(horizontalWalls);
    creatureGroup.collidesWith(verticalWalls);
    creatureGroup.collidesWith(player);
}

function update() {
    creatureGroup.moveTowards(player);
    playerMovement.checkMovement();
}

function collectStar(player, star) {
    star.disableBody(true, true);
}

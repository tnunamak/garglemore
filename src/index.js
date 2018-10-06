import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'

import Creature from './creature';

function makeCharacter (level, type) {
  getStats(level, archetypes[type].modifiers)
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [{
        preload: preload,
        create: create,
        update: update
    }]
};

var player;
var stars;
var platforms;
var cursors;
var floorWalls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'public/assets/sky.png');
    // this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'public/assets/star.png');
    // this.load.image('bomb', 'assets/bomb.png');
    this.load.image('basic_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('hotdog',   'assets/hotdog.png');
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'sky');

    floorWalls = this.physics.add.staticGroup();
    // floorWalls.add.group({
    //     key: 'basic_wall',
    //     repeat: 10,
    //     setXY: { x: 30, y: 45 },
    // })


    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
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

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(player, floorWalls);
    this.physics.add.collider(stars, floorWalls);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    
    for (var i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(100, 600);
        const y = Phaser.Math.Between(100, 600);
        let stats = {
          health: Phaser.Math.Between(1, 100) / 100,
          speed: Phaser.Math.Between(1, 100) / 100,
          attack: Phaser.Math.Between(1, 100) / 100
        }

        let creature = new Creature(this, x, y, stats);
    }
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
}
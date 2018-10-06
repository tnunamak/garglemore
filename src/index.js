import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'

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

var player;
var stars;
var platforms;
var cursors;
var horizontalWalls;
var verticalWalls;

var game = new Phaser.Game(config);

function preload() {
    // this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'public/assets/star.png');
    // this.load.image('bomb', 'assets/bomb.png');
    this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    horizontalWalls = this.physics.add.staticGroup();
    verticalWalls = this.physics.add.staticGroup();
    for (let i = 1; i <= 20; i++) {
        horizontalWalls.create(i * 60 - 30, 0, 'horizontal_wall');
        horizontalWalls.create(i * 60 - 30, 780, 'horizontal_wall');
        verticalWalls.create(0, i * 60 - 30, 'vertical_wall');
        verticalWalls.create(1200, i * 60 - 30, 'vertical_wall');
    }


    player = this.physics.add.sprite(100, 450, 'dude');

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

    this.physics.add.collider(player, horizontalWalls);
    this.physics.add.collider(player, verticalWalls);
    this.physics.add.collider(stars, horizontalWalls);

    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    if (cursors.down.isDown) {
        player.setVelocityY(160);
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    }
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(0);

        player.anims.play('turn');
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
}
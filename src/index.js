import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import { createPlayer, joinPlayer } from './player/player-create.js'
import Creature from './creature';
import Cursors from './player/player-movement.js'
import DynamicGroup from './dynamicGroup';

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

let stars;
let platforms;
var creatureGroup;
let displayStats = [];
const players = new Map();

let game = new Phaser.Game(config);

function preload() {
    this.load.image('star', 'public/assets/star.png');
    this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('zombie', 'public/assets/zombie.png', { frameWidth: 32, frameHeight: 42 });
}

function create() {
    this.data.set('players', players);
    const horizontalWalls = this.physics.add.staticGroup();
    const verticalWalls = this.physics.add.staticGroup();
    this.data.set('walls', [horizontalWalls, verticalWalls])

    // player join listener
    this.input.gamepad.on('down', function (pad, button, index) {
        if (!players.has(pad)) {
            const joinedPlayerAndMovement = joinPlayer.bind(this)(pad);
            const { player } = joinedPlayerAndMovement;
            player.playerNumber = players.size;
            players.set(pad, joinedPlayerAndMovement);
            displayStats.push(this.add.text(50, 30 * players.size, '', { font: '12px Courier', fill: '#00ff00' }));
            creatureGroup.collidesWith(player);
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
}

function update() {
    if (!players.size) {
        return
    }
    players.forEach(updatePlayer)
}

function updatePlayer({ player, movement }, gamepad) {
    movement.checkMovement(gamepad);
    creatureGroup.moveTowards(player);

    //display
    displayStats[player.playerNumber].setText([
        `Level: ${player.stats.level - 5}`,
        `Health: ${player.stats.health}/${player.stats.maxHealth}`,
        // 'Archetype: ' + this.data.get('archetype')
    ]);

    //if (gamepad.A && player.body.velocity.y >= 0) {
    //player.setVelocityY(-330);
    //}
}

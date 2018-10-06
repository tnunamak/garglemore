import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import { createPlayer, joinPlayer } from './player/player-create.js'

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
let horizontalWalls;
let verticalWalls;
// let displayStats = [];
const players = new Map();

let game = new Phaser.Game(config);

function preload() {
    this.load.image('star', 'public/assets/star.png');
    this.load.image('horizontal_wall', 'public/assets/images/basic-wall-30x60.png')
    this.load.image('vertical_wall', 'public/assets/images/vertical-wall-60x30.png')
    this.load.spritesheet('dude', 'public/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.data.set('players', players);
    horizontalWalls = this.physics.add.staticGroup();
    verticalWalls = this.physics.add.staticGroup();
    this.data.set('walls', [horizontalWalls, verticalWalls])

    // player join listener
    this.input.gamepad.on('down', function (pad, button, index) {
        if (!players.has(pad)) {
            const joinedPlayerAndMovement = joinPlayer.bind(this)(pad);
            joinedPlayerAndMovement.player.playerNumber = players.size;
            players.set(pad, joinedPlayerAndMovement);
            // displayStats.push(this.add.text(50, 50 * players.size, '', { font: '12px Courier', fill: '#00ff00' }));
        }
    }, this)

    for (let i = 1; i <= 20; i++) {
        horizontalWalls.create(i * 60 - 30, 0, 'horizontal_wall');
        horizontalWalls.create(i * 60 - 30, 780, 'horizontal_wall');
        verticalWalls.create(0, i * 60 - 30, 'vertical_wall');
        verticalWalls.create(1200, i * 60 - 30, 'vertical_wall');
    }
}

function update() {
    if (!players.size) {
        return
    }
    players.forEach(updatePlayer)
}

function updatePlayer({ player, movement }, gamepad) {
    movement.checkMovement(gamepad);
    //display
    // displayStats[player.playerNumber].setText([
    //     `Level: ${player.stats.level - 5}`,
    //     `Health: ${player.stats.health}/${player.stats.maxHealth}`,
    //     // 'Archetype: ' + this.data.get('archetype')
    // ]);

    //if (gamepad.A && player.body.velocity.y >= 0) {
    //player.setVelocityY(-330);
    //}
}

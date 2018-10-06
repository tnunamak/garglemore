import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import Cursors from './player/player-movement.js'
import { createPlayer } from './player/player-create.js'

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

let stars;
let platforms;
let playerMovement;
let horizontalWalls;
let verticalWalls;
let displayStats;

let game = new Phaser.Game(config);

function preload() {
    this.load.image('star', 'public/assets/star.png');
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
    
    // player
    createPlayer(this);
    let player = this.data.get('player');
    playerMovement = new Cursors(this, player);

    // display
    displayStats = this.add.text(50, 50, '', { font: '12px Courier', fill: '#00ff00' });
    displayStats.setText([
        `Level: ${this.data.get('playerStats').level - 5}`,
        `Health: ${this.data.get('playerStats').health}/${this.data.get('playerStats').maxHealth}`,
        // 'Archetype: ' + this.data.get('archetype')
    ]);

    // physics interactions
    this.physics.add.collider(player, horizontalWalls);
    this.physics.add.collider(player, verticalWalls);
}

function update() {
    playerMovement.checkMovement();
}
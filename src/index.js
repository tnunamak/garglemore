import 'phaser';

import archetypes from './archetypes'
import getStats from './stats'
import { createPlayer, joinPlayer } from './player/player-create.js'
import { addAnimations } from './animations.js'
import Creature from './creature';
import Cursors from './player/player-movement.js'
import DynamicGroup from './dynamicGroup';

function makeCreatureStats(level, type) {
    return getStats(level, archetypes[type].modifiers)
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

let creatureGroup;
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
            displayStats.push(this.add.text(50, 60 * players.size, '', { font: '12px Courier', fill: '#00ff00' }));
            addNewCreatureGroup(this);
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
}

function update() {
    if (!players.size) {
        return
    }
    players.forEach(updatePlayer)
}

function updatePlayer({ player, movement }, gamepad) {
    movement.checkMovement(gamepad);
    if (creatureGroup) {
        creatureGroup.moveTowards(player);
    }

    //display
    displayStats[player.playerNumber].setText([
        `Player ${player.playerNumber}`,
        `Level: ${player.stats.level - 5}`,
        `Health: ${player.stats.health}/${player.stats.maxHealth}`,
        `Speed: ${player.stats.speed}`,
        `Attack: ${player.stats.attack}`,
        player.archetype ? `Archetype: ${player.archetype}` : null,
    ]);
}

function addNewCreatureGroup(scene) {
    let creatures = [];

    for (var i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(50, 1150);
        const y = Phaser.Math.Between(50, 730);

        let stats = {
            health: Phaser.Math.Between(1, 100) / 100,
            speed: Phaser.Math.Between(1, 100) / 100,
            attack: Phaser.Math.Between(1, 100) / 100
        }

        creatures.push(new Creature(scene, x, y, stats, creatures.length));
    }

    creatureGroup = new DynamicGroup(scene, creatures);
    scene.data.get('walls').forEach(wall => creatureGroup.collidesWith(wall));
    scene.data.get('players').forEach(player => creatureGroup.collidesWith(player));
}
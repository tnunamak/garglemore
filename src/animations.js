export function addAnimations(scene) {
  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'zombie-down',
    frames: scene.anims.generateFrameNumbers('zombie', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'zombie-left',
    frames: scene.anims.generateFrameNumbers('zombie', { start: 3, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'zombie-right',
    frames: scene.anims.generateFrameNumbers('zombie', { start: 6, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'zombie-up',
    frames: scene.anims.generateFrameNumbers('zombie', { start: 9, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
}
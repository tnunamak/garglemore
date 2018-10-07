import 'phaser'

class Welcome extends Phaser.Scene {

  constructor ()
  {
      super({ key: 'welcome' });
  }

  preload ()
  {
    this.load.image('instructions', 'public/assets/images/introscreen.png')
  }

  create ()
  {
    const instructions = this.add.image(600, 380, 'instructions')
      this.input.manager.enabled = true;

      this.input.gamepad.once('down', function () {

          this.scene.start('gameScene');

      }, this);
  }

}

export default new Welcome();

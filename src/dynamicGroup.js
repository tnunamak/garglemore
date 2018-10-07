export default class DynamicGroup {
  constructor(scene, children){
    this.scene = scene;
    this.renderGroup = scene.physics.add.group();
    this.children = [];
    this.addChildren(children);
    this.collidesWith(this.renderGroup);
  }

  addChildren(children){
    for(let childIdx in children){
      this.addChild(children[childIdx]);
    }
  }

  addChild(child){
    this.children.push(child);
    this.renderGroup.add(child.sprite, false);
  }

  collidesWith(renderGroup){
    this.scene.physics.add.collider(renderGroup, this.renderGroup);
  }

  updateMovement(targetSprites) {
    this.forEach(child => {
      if (child.archetype && child.archetype.ai && child.archetype.ai.stepToward) {
        const vector = child.archetype.ai.stepToward(child, targetSprites)
        child.moveInDirection(vector)
      }
      else {
        // TODO choose the closest one by default
        child.moveTowards(targetSprites[0])
      }
    })
  }

  forEach(fn) {
    for (var childIdx = 0; childIdx < this.children.length; childIdx++) {
      let child = this.children[childIdx];
      fn(child)
    }
  }

  moveTowards(renderObj){
    this.forEach(function (child) {
      child.moveTowards(renderObj);
    })
  }
}

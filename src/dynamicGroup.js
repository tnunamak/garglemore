import constants from './constants';
import { closestTarget } from './archetypes'

export default class DynamicGroup {
  constructor(scene, children) {
    this.scene = scene;
    this.renderGroup = scene.physics.add.group();
    this.children = [];
    this.addChildren(children);
    this.collidesWith(this.renderGroup);
  }

  addChildren(children) {
    for (let childIdx in children) {
      this.addChild(children[childIdx]);
    }
  }

  addChild(child) {
    if (child.archetype && child.archetype.ai && child.archetype.ai.setup) {
      child.archetype.ai.setup(child, this.scene)
    }

    this.children.push(child);
    this.renderGroup.add(child.sprite, false);
  }

  collidesWith(renderGroup) {
    this.scene.physics.add.collider(renderGroup, this.renderGroup);
  }

  update (targetSprites) {
    this.forEach(child => {
      const movementVector = this.updateMovement(child, targetSprites)
      if (movementVector && (movementVector.x === 0 && movementVector.y === 0)) {
        this.updateAttack(child, targetSprites)
      }
    })
  }

  updateAttack(child, targetSprites) {
    if (child.archetype && child.archetype.ai && child.archetype.ai.attack) {
      child.archetype.ai.attack(child, targetSprites)
    }
  }

  updateMovement(child, targetSprites) {
    if (child.archetype && child.archetype.ai && child.archetype.ai.stepToward) {
      const vector = child.archetype.ai.stepToward(child, targetSprites)
      child.moveInDirection(vector)

      return vector
    }
    else {
      child.moveTowards(closestTarget(self, targetSprites))
    }
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


  isEveryChildDestroyed() {
    return this.children.length === 0;
  }

  removeDeadChildren(){
    let renderGroupChildren = this.renderGroup.getChildren()
    let removalIndices = [];
    for (let [index, child] of this.children.entries()) {
      if (! child.isHealthy()) {
        removalIndices.push(index);
      }
    };

    removalIndices = removalIndices.reverse();
    removalIndices.forEach(index => {
      renderGroupChildren[index].destroy();
      Phaser.Utils.Array.Remove(this.children, this.children[index]);
    })
  }

  damageByDash(attacker){
    for (var childIdx = this.children.length - 1; childIdx >= 0; childIdx--) {
      let child     = this.children[childIdx]
      let collider  = this.scene.physics.add.overlap(attacker, child.sprite, this.dashDamageDefender(child))
      child.collider = collider
      child.collider.hasActivated = false

      setTimeout(() => { if(!child) return; child.collider.hasActivated = true }, 300)
    }
  }

  removeLeftoverColliders(){
    for (var childIdx = this.children.length - 1; childIdx >= 0; childIdx--) {
      let child = this.children[childIdx]
      child.deleteCollider()
    }
  }

  dashDamageDefender(childDefender){
      return function(attacker, defender){
        if (!childDefender.collider || childDefender.collider.hasActivated) {
          return;
        }

        let attackDamage = attacker.stats.attack * constants.dashDamageFactor
        childDefender.damage(attackDamage)
        childDefender.collider.hasActivated = true
        if (!childDefender.isHealthy())
          attacker.lastKilled = childDefender
      }
    }
}

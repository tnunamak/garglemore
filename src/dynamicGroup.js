export default class DynamicGroup{

	constructor(scene, children){
		this.scene 			= scene;
		this.renderGroup 	= scene.physics.add.group();
		this.children 		= [];
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

	moveTowards(renderObj){
		for (var childIdx = 0; childIdx < this.children.length; childIdx++) {
			let child = this.children[childIdx];
			child.moveTowards(renderObj);
		}
	}

	isEveryChildDestroyed() {
		let resetGroup = true;
		
		let renderGroupChildren = this.renderGroup.getChildren()
		let removalIndices = [];
		for (let [index, child] of renderGroupChildren.entries()) {
			let childIsHealthy = child.isHealthy();
			if (childIsHealthy) {
				resetGroup = false;
				console.log('all good')
				break;
			}
			
			// if child is NOT healthy, destroy
			removalIndices.push(index);
		};

		removalIndices = removalIndices.reverse();
		removalIndices.forEach(index => {
				renderGroupChildren[index].destroy();
				Phaser.Utils.Array.Remove(creatureGroup.children, creatureGroup.children[index]);
		})

		return resetGroup;
	}
}

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
		this.children.push(child);
		this.renderGroup.add(child.sprite, false);
	}

	collidesWith(renderGroup) {
		this.scene.physics.add.collider(renderGroup, this.renderGroup);
	}

	moveTowards(renderObj) {
		for (var childIdx = 0; childIdx < this.children.length; childIdx++) {
			let child = this.children[childIdx];
			child.moveTowards(renderObj);
		}
	}

	isEveryChildDestroyed() {
		let resetGroup = true;
		let lastMonsterData;
		let renderGroupChildren = this.renderGroup.getChildren()
		let removalIndices = [];
		for (let [index, child] of this.children.entries()) {
			let childIsHealthy = child.isHealthy();
			if (childIsHealthy) {
				resetGroup = false;
				break;
			}

			// if child is NOT healthy, destroy
			removalIndices.push(index);
		};

		removalIndices = removalIndices.reverse();
		removalIndices.forEach(index => {
			lastMonsterData = Object.assign(renderGroupChildren[index]);
			renderGroupChildren[index].destroy();
			Phaser.Utils.Array.Remove(this.children, this.children[index]);
		})

		return {
			resetGroup,
			lastMonsterData
		};
	}
}

import constants from './constants';

export default class Creature{

	constructor(scene, x, y, stats, creatureIndex){
		this.scene 	= scene;
		this.sprite = scene.physics.add.sprite(x, y, 'zombie');
		this.stats 	= stats;
		this.scale 	= this.getScaleFromStats(stats);
		this.sprite.setScale(this.scale);
		this.creatureIndex = creatureIndex;
	}

	getScaleFromStats(statVals){	
		let statSum = 0.0;

		for(let statName in statVals){
			let statVal = statVals[statName]
			if(statName == 'speed')
				statVal = 1 - statVals[statName];

			statSum = statSum + statVal;
		}

		let scale = statSum / Object.keys(statVals).length;
		return scale + 1;
	}

	moveTowards(renderObj){
		let pxSpeed = this.getSpeedInPx();
		this.scene.physics.moveToObject(this.sprite, renderObj, pxSpeed);
		this.animateMovement(renderObj);
	}

	animateMovement(renderObj){
		let direction = this.getMovementDirection(renderObj);
      	this.sprite.anims.play('zombie-' + direction, true);
	}

	getMovementDirection(renderObj){
		let deltaX = renderObj.x - this.sprite.x;
		let deltaY = renderObj.y - this.sprite.y;
		
		if(Math.abs(deltaX) <= Math.abs(deltaY) && deltaY < 0){
			return 'up';
		}

		if(Math.abs(deltaX) <= Math.abs(deltaY) && deltaY > 0){
			return 'down';
		}

		if (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX > 0) {
			return 'right';
		}

		if (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX < 0) {
			return 'left';
		}

		return 'down';
	}

	getSpeedInPx(){
		const SPEED_UNIT_PX 	= constants.monsterBaseSpeed;

		return this.getSpeed() * SPEED_UNIT_PX;
	}

	getSpeed(){
		const MAX_SPEED_PCT 	= 0.6; 
		const MIN_SPEED_PCT 	= 0.2; 

		if (this.stats.speed > MAX_SPEED_PCT) {
			return MAX_SPEED_PCT;
		}

		if (this.stats.speed < MIN_SPEED_PCT) {
			return MIN_SPEED_PCT;
		}

		return this.stats.speed;
	}

	isHealthy() {
		return this.stats.health >= 0;
	}
}

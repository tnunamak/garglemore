export default class Creature{

	constructor(scene, x, y, stats){
		this.scene 	= scene;
		this.x 		= x;
		this.y 		= y;
		this.sprite = scene.physics.add.sprite(x, y, 'zombie');
		this.stats 	= stats;
		this.scale 	= this.getScaleFromStats(stats);
		this.sprite.setScale(this.scale);
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
	}

	getSpeedInPx(){
		const SPEED_UNIT_PX 	= 350;

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
}

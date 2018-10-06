export default class Creature{

	constructor(scene, x, y, stats){
		this.x 		= x;
		this.y 		= y;
		this.sprite = scene.physics.add.sprite(x, y, 'hotdog');
		this.stat 	= stats;
		this.scale 	= this.getScaleFromStats(stats);
		this.sprite.setScale(this.scale);
	}

	getScaleFromStats(statVals){	
		let statSum = 0.0;

		for(let statName in statVals){
			statSum = statSum + statVals[statName];
		}

		let scale = statSum / Object.keys(statVals).length;
		return scale;
	}
}


namespace ThisCouldBeBetter.GameFramework
{

export class Weapon
{
	ticksToRecharge: number;
	entityProjectile: Entity;

	range: number;
	tickLastFired: number;

	constructor(ticksToRecharge: number, entityProjectile: Entity)
	{
		this.ticksToRecharge = ticksToRecharge;
		this.entityProjectile = entityProjectile;

		var speedMax = Movable.of(this.entityProjectile).speedMax(null);
		var ticksToLive = Ephemeral.of(this.entityProjectile).ticksToLive;

		this.range = speedMax * ticksToLive;

		this.tickLastFired = 0 - this.ticksToRecharge;
	}
}

}

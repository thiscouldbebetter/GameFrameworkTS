
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_SpeedMaxXY implements Constraint
{
	targetSpeedMax: number;

	constructor(targetSpeedMax: number)
	{
		this.targetSpeedMax = targetSpeedMax;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSpeedMax = this.targetSpeedMax;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var zSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed > targetSpeedMax)
		{
			entityVel.normalize().multiplyScalar(targetSpeedMax);
		}
		entityVel.z = zSaved;
	}
}

}
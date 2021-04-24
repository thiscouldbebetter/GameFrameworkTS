
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionXY implements Constraint
{
	target: number;
	speedBelowWhichToStop: number;

	constructor(target: number, speedBelowWhichToStop: number)
	{
		this.target = target;
		this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetFrictionCoefficient = this.target;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var entityVelZSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed < this.speedBelowWhichToStop)
		{
			entityVel.clear();
		}
		else
		{
			var frictionMagnitude = speed * targetFrictionCoefficient;
			entityVel.add
			(
				entityVel.clone().multiplyScalar(-frictionMagnitude)
			);
		}
		entityVel.z = entityVelZSaved;
	}
}

}

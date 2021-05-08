
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionDry implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		var targetFrictionCoefficient = this.target;
		var frictionMagnitude = targetFrictionCoefficient;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var entitySpeed = entityVel.magnitude();
		if (entitySpeed <= frictionMagnitude)
		{
			entityVel.clear();
		}
		else
		{
			var entityDirection = entityVel.clone().normalize();
			entityVel.add
			(
				entityDirection.multiplyScalar(-frictionMagnitude)
			);
		}
	}
}

}

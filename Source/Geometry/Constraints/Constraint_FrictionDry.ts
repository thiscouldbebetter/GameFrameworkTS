
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionDry implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

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

	// Clonable.

	clone(): Constraint
	{
		return this; // todo
	}

	overwriteWith(other: Constraint): Constraint
	{
		return this; // todo
	}

}

}

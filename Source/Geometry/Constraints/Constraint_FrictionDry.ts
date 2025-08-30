
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionDry extends ConstraintBase
{
	frictionCoefficient: number;

	constructor(frictionCoefficient: number)
	{
		super();

		this.frictionCoefficient = frictionCoefficient;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var targetFrictionCoefficient = this.frictionCoefficient;
		var frictionMagnitude = targetFrictionCoefficient;
		var entityLoc = Locatable.of(entity).loc;
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

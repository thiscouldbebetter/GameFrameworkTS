
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Movable implements Constraint
{
	static create(): Constraint_Movable
	{
		return new Constraint_Movable();
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var entityLoc = Locatable.of(entity).loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		var entityMovable = Movable.of(entity);
		var speedMax = entityMovable.speedMax(uwpe);
		if (speed > speedMax)
		{
			entityVel
				.normalize()
				.multiplyScalar(speedMax);
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

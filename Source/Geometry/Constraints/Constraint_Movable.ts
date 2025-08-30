
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Movable extends ConstraintBase
{
	static create(): Constraint_Movable
	{
		return new Constraint_Movable().nameSet(Constraint_Movable.name);
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
}

}

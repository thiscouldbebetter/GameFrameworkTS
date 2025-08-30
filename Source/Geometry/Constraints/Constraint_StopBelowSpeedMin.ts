
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_StopBelowSpeedMin extends ConstraintBase
{
	target: number;

	constructor(target: number)
	{
		super();

		this.target = target;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetSpeedMin = this.target;
		var entityLoc = Locatable.of(uwpe.entity).loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		if (speed < targetSpeedMin)
		{
			entityVel.clear();
		}
	}
}

}

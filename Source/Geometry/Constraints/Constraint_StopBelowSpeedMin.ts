
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_StopBelowSpeedMin implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetSpeedMin = this.target;
		var entityLoc = uwpe.entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		if (speed < targetSpeedMin)
		{
			entityVel.clear();
		}
	}
}

}

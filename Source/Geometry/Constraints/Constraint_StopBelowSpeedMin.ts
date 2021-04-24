
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_StopBelowSpeedMin implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSpeedMin = this.target;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		if (speed < targetSpeedMin)
		{
			entityVel.clear();
		}
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToRange implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetRange = this.target;
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.wrapToRangeMax(targetRange);
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_TrimToRange implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSize = this.target;
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.trimToRangeMax(targetSize);
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Offset implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetOffset = this.target;
		entity.locatable().loc.pos.add(targetOffset);
	}
}

}

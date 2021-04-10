
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Offset implements Constraint
{
	offset: Coords;

	constructor(offset: Coords)
	{
		this.offset = offset;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		entity.locatable().loc.pos.add(this.offset);
	}
}

}

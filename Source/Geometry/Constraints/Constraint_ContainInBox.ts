
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_ContainInBox implements Constraint
{
	boxToContainWithin: Box;

	constructor(boxToContainWithin: Box)
	{
		this.boxToContainWithin = boxToContainWithin;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.boxToContainWithin.trimCoords(entity.locatable().loc.pos);
	}
}

}

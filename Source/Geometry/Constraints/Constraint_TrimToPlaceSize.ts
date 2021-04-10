
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_TrimToPlaceSize implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.trimToRangeMax(place.size);
	}
}

}

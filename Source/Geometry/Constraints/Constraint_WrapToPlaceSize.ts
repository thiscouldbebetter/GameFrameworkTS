
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSize implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.wrapToRangeMax(place.size);
	}
}

}

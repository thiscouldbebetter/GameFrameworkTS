namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSizeXTrimY implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		var placeSize = place.size;

		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
		entityPos.y = NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
	}
}

}

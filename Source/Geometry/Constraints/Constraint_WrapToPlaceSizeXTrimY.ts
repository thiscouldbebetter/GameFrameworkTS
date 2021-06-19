namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSizeXTrimY implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var placeSize = place.size;

		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
		entityPos.y = NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
	}
}

}

namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSizeX extends ConstraintBase
{
	static create(): Constraint_WrapToPlaceSizeX
	{
		return new Constraint_WrapToPlaceSizeX();
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var placeSize = place.size();

		var entityLoc = Locatable.of(entity).loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
	}

}

}

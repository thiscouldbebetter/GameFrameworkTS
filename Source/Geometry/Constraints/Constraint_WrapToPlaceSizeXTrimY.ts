namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSizeXTrimY implements Constraint
{
	static create(): Constraint_WrapToPlaceSizeXTrimY
	{
		return new Constraint_WrapToPlaceSizeXTrimY();
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var placeSize = place.size();

		var entityLoc = Locatable.of(entity).loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
		entityPos.y = NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
	}

	// Clonable.

	clone(): Constraint
	{
		return this; // todo
	}

	overwriteWith(other: Constraint): Constraint
	{
		return this; // todo
	}

}

}

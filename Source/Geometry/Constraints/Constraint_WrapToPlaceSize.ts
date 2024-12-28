
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSize implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;
		var placeSize = place.size();
		entityLoc.pos.wrapToRangeMax(placeSize);
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


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_TrimToPlaceSize implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityLoc = Locatable.of(uwpe.entity).loc;
		var placeSize = uwpe.place.size();
		entityLoc.pos.trimToRangeMax(placeSize);
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

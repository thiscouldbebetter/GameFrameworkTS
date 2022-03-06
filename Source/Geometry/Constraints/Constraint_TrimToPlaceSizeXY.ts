
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_TrimToPlaceSizeXY implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityLoc = uwpe.entity.locatable().loc;
		var entityPos = entityLoc.pos;
		entityPos.trimToRangeMaxXY(uwpe.place.size);
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

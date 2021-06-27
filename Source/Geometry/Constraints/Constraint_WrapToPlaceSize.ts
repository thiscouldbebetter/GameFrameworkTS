
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSize implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var entityLoc = entity.locatable().loc;
		entityLoc.pos.wrapToRangeMax(place.size);
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

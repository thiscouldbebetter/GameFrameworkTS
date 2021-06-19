
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_TrimToPlaceSize implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityLoc = uwpe.entity.locatable().loc;
		entityLoc.pos.trimToRangeMax(uwpe.place.size);
	}
}

}

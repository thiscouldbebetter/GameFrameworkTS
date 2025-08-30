
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSize extends ConstraintBase
{
	static create(): Constraint_WrapToPlaceSize
	{
		return new Constraint_WrapToPlaceSize();
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;
		var placeSize = place.size();
		entityLoc.pos.wrapToRangeMax(placeSize);
	}

}

}

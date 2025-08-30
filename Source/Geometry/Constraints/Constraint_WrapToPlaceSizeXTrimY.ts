namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapToPlaceSizeXTrimY extends ConstraintBase
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

		// Cancel any velocity that attempts to push past the boundary.
		var entityVel = entityLoc.vel;
		if (entityPos.y < 0 && entityVel.y < 0)
		{
			entityVel.y = 0;
		}
		else if (entityPos.y > placeSize.y && entityVel.y > 0)
		{
			entityVel.y = 0;
		}

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
		entityPos.y = NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
	}
}

}

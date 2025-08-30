
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Stop extends ConstraintBase
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityLoc = Locatable.of(entity).loc;
		var entityVel = entityLoc.vel;
		entityVel.clear();
	}
}

}

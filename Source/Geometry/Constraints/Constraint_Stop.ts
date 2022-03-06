
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Stop implements Constraint
{
	constructor()
	{}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		entityVel.clear();
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

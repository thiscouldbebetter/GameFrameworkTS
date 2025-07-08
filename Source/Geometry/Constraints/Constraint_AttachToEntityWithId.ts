
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithId implements Constraint
{
	targetEntityId: number;

	constructor(targetEntityId: number)
	{
		this.targetEntityId = targetEntityId;
	}

	static fromTargetEntityId
	(
		targetEntityId: number
	): Constraint_AttachToEntityWithId
	{
		return new Constraint_AttachToEntityWithId(targetEntityId);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetEntity =
			uwpe.place.entityById(this.targetEntityId);

		if (targetEntity != null)
		{
			var targetPos = Locatable.of(targetEntity).loc.pos;
			Locatable.of(uwpe.entity).loc.pos.overwriteWith(targetPos);
		}
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

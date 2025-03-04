
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithName implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var targetEntity = place.entityByName(this.targetEntityName);
		if (targetEntity != null)
		{
			var targetPos = Locatable.of(targetEntity).loc.pos;
			Locatable.of(entity).loc.pos.overwriteWith(targetPos);
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

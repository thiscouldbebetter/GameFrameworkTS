
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithName extends ConstraintBase
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		super();

		this.targetEntityName = targetEntityName;
	}

	static fromTargetEntityName
	(
		targetEntityName: string
	): Constraint_AttachToEntityWithName
	{
		return new Constraint_AttachToEntityWithName(targetEntityName);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetEntity =
			uwpe.place.entityByName(this.targetEntityName);

		if (targetEntity != null)
		{
			var targetPos = Locatable.of(targetEntity).loc.pos;
			var entityToConstrain = uwpe.entity;
			var entityToConstrainPos = Locatable.of(entityToConstrain).loc.pos;
			entityToConstrainPos.overwriteWith(targetPos);
		}
	}
}

}

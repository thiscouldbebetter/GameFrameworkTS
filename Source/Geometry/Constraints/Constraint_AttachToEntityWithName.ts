
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
		var place = uwpe.place;
		var entity = uwpe.entity;

		var targetEntity = place.entityByName(this.targetEntityName);
		if (targetEntity != null)
		{
			var targetPos = Locatable.of(targetEntity).loc.pos;
			var entityLocatable = Locatable.of(entity);
			var entityPos = entityLocatable.loc.pos;
			entityPos.overwriteWith(targetPos);
		}
	}
}

}

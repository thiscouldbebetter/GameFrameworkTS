
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithId implements Constraint
{
	targetEntityId: number

	constructor(targetEntityId: number)
	{
		this.targetEntityId = targetEntityId;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetEntity = uwpe.place.entityById(this.targetEntityId);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			uwpe.entity.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}

}

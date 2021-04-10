
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithId implements Constraint
{
	targetEntityId: number

	constructor(targetEntityId: number)
	{
		this.targetEntityId = targetEntityId;
	}

	constrain
	(
		universe: Universe, world: World, place: Place, entityToConstrain: Entity
	): void
	{
		var targetEntity = place.entityById(this.targetEntityId);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}

}

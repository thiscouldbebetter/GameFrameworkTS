
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_AttachToEntityWithName implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe: Universe, world: World, place: Place, entityToConstrain: Entity)
	{
		var targetEntity = place.entityByName(this.targetEntityName);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}

}

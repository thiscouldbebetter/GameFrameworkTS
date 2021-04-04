
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_OrientToward implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetEntityName = this.targetEntityName;

		var constrainableLoc = entity.locatable().loc;
		var constrainablePos = constrainableLoc.pos;
		var constrainableOrientation = constrainableLoc.orientation;
		var constrainableForward = constrainableOrientation.forward;

		var target = place.entitiesByName.get(targetEntityName);
		var targetPos = target.locatable().loc.pos;

		constrainableForward.overwriteWith
		(
			targetPos
		).subtract
		(
			constrainablePos
		).normalize();

		constrainableOrientation.forwardSet(constrainableForward);
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_OrientToward implements Constraint
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

		var targetEntityName = this.targetEntityName;

		var constrainableLoc = entity.locatable().loc;
		var constrainablePos = constrainableLoc.pos;
		var constrainableOrientation = constrainableLoc.orientation;
		var constrainableForward = constrainableOrientation.forward;

		var target = place.entityByName(targetEntityName);
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

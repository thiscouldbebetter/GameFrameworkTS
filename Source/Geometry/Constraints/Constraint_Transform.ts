
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Transform implements Constraint
{
	transformToApply: TransformBase;

	constructor(transformToApply: TransformBase)
	{
		this.transformToApply = transformToApply;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var constrainablePos = Locatable.of(uwpe.entity).loc.pos;
		this.transformToApply.transformCoords(constrainablePos);
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


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Transform extends ConstraintBase
{
	transformToApply: TransformBase;

	constructor(transformToApply: TransformBase)
	{
		super();

		this.transformToApply = transformToApply;
	}

	static fromTransform(transformToApply: TransformBase): Constraint_Transform
	{
		return new Constraint_Transform(transformToApply);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var constrainablePos = Locatable.of(uwpe.entity).loc.pos;
		this.transformToApply.transformCoords(constrainablePos);
	}
}

}

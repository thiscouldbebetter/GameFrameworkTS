
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_ContainInBox extends ConstraintBase
{
	boxToContainWithin: BoxAxisAligned;

	constructor(boxToContainWithin: BoxAxisAligned)
	{
		super();

		this.boxToContainWithin = boxToContainWithin;
	}

	static fromBox(boxToContainWithin: BoxAxisAligned): Constraint_ContainInBox
	{
		return new Constraint_ContainInBox(boxToContainWithin);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var constrainablePos =Locatable.of(uwpe.entity).loc.pos;
		this.boxToContainWithin.trimCoords(constrainablePos);
	}
}

}

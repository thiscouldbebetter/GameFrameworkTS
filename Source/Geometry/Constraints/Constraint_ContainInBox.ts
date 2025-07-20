
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_ContainInBox implements Constraint
{
	boxToContainWithin: BoxAxisAligned;

	constructor(boxToContainWithin: BoxAxisAligned)
	{
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

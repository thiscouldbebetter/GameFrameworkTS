
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
		this.boxToContainWithin.trimCoords(Locatable.of(uwpe.entity).loc.pos);
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


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_ContainInBox implements Constraint
{
	boxToContainWithin: Box;

	constructor(boxToContainWithin: Box)
	{
		this.boxToContainWithin = boxToContainWithin;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		this.boxToContainWithin.trimCoords(uwpe.entity.locatable().loc.pos);
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

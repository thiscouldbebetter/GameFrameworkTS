
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Offset implements Constraint
{
	offset: Coords;

	constructor(offset: Coords)
	{
		this.offset = offset;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.entity.locatable().loc.pos.add(this.offset);
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

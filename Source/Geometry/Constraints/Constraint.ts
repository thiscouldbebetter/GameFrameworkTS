
namespace ThisCouldBeBetter.GameFramework
{

export interface Constraint extends Clonable<Constraint>
{
	constrain: (uwpe: UniverseWorldPlaceEntities) => void;
}

export class Constraint_None implements Constraint
{
	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
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

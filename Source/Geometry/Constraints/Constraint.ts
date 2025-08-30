
namespace ThisCouldBeBetter.GameFramework
{

export interface Constraint extends Clonable<Constraint>
{
	constrain(uwpe: UniverseWorldPlaceEntities): void;
	name: string;
	nameSet(value: string): Constraint;
}

export class ConstraintBase implements Constraint
{
	name: string;

	constrain(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Must be implemented in subclass."); }

	nameSet(value: string): Constraint
	{
		this.name = value;
		return this;
	}

	// Clonable.

	clone(): Constraint { return this; } // hack

	overwriteWith(other: Constraint): Constraint { throw new Error("Must be implemented in subclass."); }

}

export class Constraint_None extends ConstraintBase
{
	constructor() { super(); }

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
